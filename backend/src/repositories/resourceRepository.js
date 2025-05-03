const Resource = require('../models/Resource');
const Course = require('../models/Course');
const path = require('path');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

/**
 * Repository for Resource-related database operations
 */
class ResourceRepository {
    constructor() {
        // Define base upload directory
        this.uploadDir = path.join(__dirname, '../../uploads');
        
        // Create upload directory if it doesn't exist
        this.ensureUploadDirExists();
    }
    
    /**
     * Ensure upload directories exist
     * @private
     */
    async ensureUploadDirExists() {
        try {
            // Create base upload directory if it doesn't exist
            if (!fs.existsSync(this.uploadDir)) {
                await mkdir(this.uploadDir, { recursive: true });
            }
        } catch (error) {
            console.error(`Error creating upload directory: ${error.message}`);
            throw new Error('Failed to create upload directory');
        }
    }
    
    /**
     * Get course-specific upload directory
     * @private
     * @param {string} courseId - Course ID
     * @returns {string} Path to course upload directory
     */
    async getCourseUploadDir(courseId) {
        const courseDir = path.join(this.uploadDir, courseId.toString());
        
        // Create course directory if it doesn't exist
        if (!fs.existsSync(courseDir)) {
            await mkdir(courseDir, { recursive: true });
        }
        
        return courseDir;
    }
    
    /**
     * Save file to disk
     * @private
     * @param {Buffer} fileBuffer - File data
     * @param {string} courseId - Course ID
     * @param {string} filename - File name
     * @returns {string} File URL (path)
     */
    async saveFile(fileBuffer, courseId, filename) {
        try {
            const courseDir = await this.getCourseUploadDir(courseId);
            
            // Add timestamp to filename to ensure uniqueness
            const timestamp = Date.now();
            const uniqueFilename = `${timestamp}-${filename}`;
            const filePath = path.join(courseDir, uniqueFilename);
            
            // Write file to disk
            await writeFile(filePath, fileBuffer);
            
            // Return relative path from upload directory
            return path.join(courseId.toString(), uniqueFilename);
        } catch (error) {
            throw new Error(`Error saving file: ${error.message}`);
        }
    }
    
    /**
     * Get file from disk
     * @param {string} fileUrl - File URL (path)
     * @returns {Promise<Buffer>} File data
     */
    async getFile(fileUrl) {
        try {
            const filePath = path.join(this.uploadDir, fileUrl);
            return await readFile(filePath);
        } catch (error) {
            throw new Error(`Error reading file: ${error.message}`);
        }
    }
    
    /**
     * Delete file from disk
     * @private
     * @param {string} fileUrl - File URL (path)
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async deleteFile(fileUrl) {
        try {
            const filePath = path.join(this.uploadDir, fileUrl);
            if (fs.existsSync(filePath)) {
                await unlink(filePath);
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(`Error deleting file: ${error.message}`);
        }
    }
    
    /**
     * Create a new resource with file upload
     * @param {Object} resourceData - Resource data
     * @param {Buffer} fileBuffer - File data
     * @param {string} filename - Original filename
     * @returns {Promise<Object>} Created resource
     */
    async createResource(resourceData, fileBuffer, filename) {
        try {
            // Verify course exists
            const course = await Course.findById(resourceData.courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            
            // Determine file type from extension
            const fileExtension = path.extname(filename).toLowerCase();
            let fileType = 'document'; // Default
            
            // Map common extensions to file types
            if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(fileExtension)) {
                fileType = 'image';
            } else if (['.mp4', '.avi', '.mov', '.wmv'].includes(fileExtension)) {
                fileType = 'video';
            } else if (['.mp3', '.wav', '.ogg'].includes(fileExtension)) {
                fileType = 'audio';
            } else if (['.pdf'].includes(fileExtension)) {
                fileType = 'pdf';
            } else if (['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'].includes(fileExtension)) {
                fileType = 'office';
            }
            
            // Save file to disk
            const fileUrl = await this.saveFile(fileBuffer, resourceData.courseId, filename);
            
            // Create resource document
            const resource = new Resource({
                title: resourceData.title || filename,
                description: resourceData.description || '',
                fileUrl,
                fileType,
                courseId: resourceData.courseId,
                uploadedBy: resourceData.uploadedBy
            });
            
            await resource.save();
            return resource;
        } catch (error) {
            throw new Error(`Error creating resource: ${error.message}`);
        }
    }
    
    /**
     * Find resource by ID
     * @param {string} id - Resource ID
     * @returns {Promise<Object|null>} Resource or null if not found
     */
    async findById(id) {
        try {
            return await Resource.findById(id);
        } catch (error) {
            throw new Error(`Error finding resource by ID: ${error.message}`);
        }
    }
    
    /**
     * Get all resources for a course
     * @param {string} courseId - Course ID
     * @returns {Promise<Array>} List of resources
     */
    async findByCourse(courseId) {
        try {
            return await Resource.find({ courseId })
                .sort({ uploadedAt: -1 }); // Most recent first
        } catch (error) {
            throw new Error(`Error finding resources by course: ${error.message}`);
        }
    }
    
    /**
     * Update resource (metadata only)
     * @param {string} id - Resource ID
     * @param {Object} updateData - Data to update (title, description)
     * @returns {Promise<Object|null>} Updated resource or null if not found
     */
    async updateResource(id, updateData) {
        try {
            // Only allow updating title and description
            const allowedUpdates = {
                title: updateData.title,
                description: updateData.description
            };
            
            return await Resource.findByIdAndUpdate(
                id,
                allowedUpdates,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(`Error updating resource: ${error.message}`);
        }
    }
    
    /**
     * Delete resource and its file
     * @param {string} id - Resource ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async deleteResource(id) {
        try {
            const resource = await Resource.findById(id);
            if (!resource) return false;
            
            // Delete file from disk
            await this.deleteFile(resource.fileUrl);
            
            // Delete resource document
            await Resource.findByIdAndDelete(id);
            
            return true;
        } catch (error) {
            throw new Error(`Error deleting resource: ${error.message}`);
        }
    }
    
    /**
     * Get resources by type
     * @param {string} courseId - Course ID
     * @param {string} fileType - File type (image, video, etc.)
     * @returns {Promise<Array>} List of resources
     */
    async findByType(courseId, fileType) {
        try {
            return await Resource.find({ courseId, fileType })
                .sort({ uploadedAt: -1 });
        } catch (error) {
            throw new Error(`Error finding resources by type: ${error.message}`);
        }
    }
    
    /**
     * Search resources
     * @param {string} courseId - Course ID
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} List of resources
     */
    async searchResources(courseId, searchTerm) {
        try {
            return await Resource.find({
                courseId,
                $or: [
                    { title: new RegExp(searchTerm, 'i') },
                    { description: new RegExp(searchTerm, 'i') }
                ]
            }).sort({ uploadedAt: -1 });
        } catch (error) {
            throw new Error(`Error searching resources: ${error.message}`);
        }
    }
}

module.exports = new ResourceRepository();
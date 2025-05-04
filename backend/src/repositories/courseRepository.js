const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * Repository for Course-related database operations
 */
class CourseRepository {
    /**
     * Create a new course
     * @param {Object} courseData - Course data
     * @returns {Promise<Object>} Created course
     */
    async createCourse(courseData) {
        try {
            const course = new Course(courseData);
            await course.save();
            return course;
        } catch (error) {
            throw new Error(`Error creating course: ${error.message}`);
        }
    }
    
    /**
     * Find course by ID
     * @param {string} id - Course ID
     * @returns {Promise<Object|null>} Course or null if not found
     */
    async findById(id) {
        try {
            return await Course.findById(id);
        } catch (error) {
            throw new Error(`Error finding course by ID: ${error.message}`);
        }
    }
    
    /**
     * Find course by code
     * @param {string} code - Course code
     * @returns {Promise<Object|null>} Course or null if not found
     */
    async findByCode(code) {
        try {
            return await Course.findOne({ code });
        } catch (error) {
            throw new Error(`Error finding course by code: ${error.message}`);
        }
    }
    
    /**
     * Update course
     * @param {string} id - Course ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} Updated course or null if not found
     */
    async updateCourse(id, updateData) {
        try {
            return await Course.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(`Error updating course: ${error.message}`);
        }
    }
    
    /**
     * Delete course
     * @param {string} id - Course ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async deleteCourse(id) {
        try {
            const result = await Course.findByIdAndDelete(id);
            if (result) {
                // Delete all enrollments for this course
                await Enrollment.deleteMany({ courseId: id });
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(`Error deleting course: ${error.message}`);
        }
    }
    
    /**
     * Find courses by instructor
     * @param {string} instructorId - Instructor user ID
     * @returns {Promise<Array>} List of courses
     */
    async findByInstructor(instructorId) {
        try {
            return await Course.find({ instructorId });
        } catch (error) {
            throw new Error(`Error finding courses by instructor: ${error.message}`);
        }
    }
    
    /**
     * Find courses by status
     * @param {string} status - Course status
     * @returns {Promise<Array>} List of courses
     */
    async findByStatus(status) {
        try {
            return await Course.find({ status });
        } catch (error) {
            throw new Error(`Error finding courses by status: ${error.message}`);
        }
    }
    
    /**
     * Get all courses with pagination and filtering
     * @param {Object} filters - Filter criteria
     * @param {number} page - Page number (1-indexed)
     * @param {number} limit - Number of items per page
     * @returns {Promise<Object>} Object with courses and pagination data
     */
    async getAllCourses(filters = {}, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            
            // Build query based on filters
            const query = {};
            if (filters.status) query.status = filters.status;
            if (filters.instructorId) query.instructorId = filters.instructorId;
            if (filters.search) {
                query.$or = [
                    { title: new RegExp(filters.search, 'i') },
                    { description: new RegExp(filters.search, 'i') },
                    { code: new RegExp(filters.search, 'i') }
                ];
            }
            
            const courses = await Course.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }); // Sort by newest first
                
            const total = await Course.countDocuments(query);
            
            return {
                courses,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error getting all courses: ${error.message}`);
        }
    }
    
    /**
     * Get enrolled students for a course
     * @param {string} courseId - Course ID
     * @returns {Promise<Array>} List of enrollment records with user data
     */
    async getEnrolledStudents(courseId) {
        try {
            return await Enrollment.find({ courseId })
                .populate({
                    path: 'userId',
                    populate: {
                        path: 'person',
                        model: 'Person'
                    }
                });
        } catch (error) {
            throw new Error(`Error getting enrolled students: ${error.message}`);
        }
    }
    
    /**
     * Enroll a student in a course
     * @param {string} userId - User ID
     * @param {string} courseId - Course ID
     * @returns {Promise<Object>} Enrollment record
     */
    async enrollStudent(userId, courseCode) {
        try {
            // Check if already enrolled
            const existingEnrollment = await Enrollment.findOne({ userId, courseCode });
            if (existingEnrollment) {
                return existingEnrollment;
            }
            
            // Check if course exists
            const course = await Course.findOne({code: courseCode});
            if (!course) {
                throw new Error('Course not found');
            }
            
            // Create enrollment
            const enrollment = new Enrollment({
                userId,
                courseId: course._id,
                status: 'active',
                progress: 0,
                enrollmentDate: new Date()
            });
            
            await enrollment.save();
            
            // Adding enrolled studnets to the array
            if (!course.enrolledStudents.includes(userId)) {
                course.enrolledStudents.push(userId);
                await course.save(); // Save the updated course
            }
            return enrollment;
        } catch (error) {
            throw new Error(`Error enrolling student: ${error.message}`);
        }
    }
    
    /**
     * Unenroll a student from a course
     * @param {string} userId - User ID
     * @param {string} courseId - Course ID
     * @returns {Promise<boolean>} True if unenrolled, false if not found
     */
    async unenrollStudent(userId, courseId) {
        try {
            const result = await Enrollment.findOneAndDelete({ userId, courseId });
            return !!result;
        } catch (error) {
            throw new Error(`Error unenrolling student: ${error.message}`);
        }
    }
    
    /**
     * Get courses for a student
     * @param {string} userId - User ID
     * @returns {Promise<Array>} List of courses with enrollment data
     */
    async getStudentCourses(userId) {
        try {
            const enrollments = await Enrollment.find({ userId });
            
            // if (Object.keys(enrollments).length === 0) {
            //     return {}
            // }
            // Get course IDs from enrollments
            const courseIds = enrollments.map(e => e.courseId);
            
            // Get all courses
            const courses = await Course.find({ _id: { $in: courseIds } });
            
            // Add enrollment data to each course
            return courses.map(course => {
                const enrollment = enrollments.find(e => 
                    e.courseId.toString() === course._id.toString()
                );
                
                return {
                    ...course.toJSON(),
                    enrollment: enrollment.toJSON()
                };
            });
        } catch (error) {
            throw new Error(`Error getting student courses: ${error.message}`);
        }
    }
}

module.exports = new CourseRepository();
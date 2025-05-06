const courseRepository = require('../repositories/courseRepository');
const userRepository = require('../repositories/userRepository');
const asyncHandler = require('../middleware/asyncHandler');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
/**
 * Get all courses
 * @route GET /api/courses
 * @access Public
 */
exports.getAllCourses = asyncHandler(async (req, res) => {
    // Get query parameters for filtering and pagination
    const { status, search, page = 1, limit = 10 } = req.query;
    const instructorId = req.query.instructor;
    
    // Build filters object
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (instructorId) filters.instructorId = instructorId;
    
    // Get courses using repository
    const result = await courseRepository.getAllCourses(filters, page, limit);
    
    res.status(200).json({
        success: true,
        count: result.courses.length,
        pagination: result.pagination,
        data: result.courses
    });
});

/**
 * Get course by code
 * @route GET /api/courses/:code
 * @access Public
 */
exports.getCourseByCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    
    if (!code) {
        return res.status(400).json({ error: 'Course code is required' });
    }
    
    const course = await courseRepository.findByCode(code);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json({
        success: true,
        data: course
    });
});

/**
 * Create new course
 * @route POST /api/courses
 * @access Private (Instructors, Admins)
 */
exports.addCourse = asyncHandler(async (req, res) => {
    const { title, code, description, status, enrollmentCapacity, startDate, endDate, imageUrl } = req.body;
    
    // Check if course with same title or code exists
    const existingCourse = await courseRepository.findByCode(code);
    if (existingCourse) {
        return res.status(400).json({ error: 'Course with this code already exists' });
    }
    
    // Create course data object
    const courseData = {
        title,
        code,
        description,
        status: status || 'upcoming',
        enrollmentCapacity: enrollmentCapacity || 30,
        startDate: startDate || new Date(),
        endDate,
        instructorId: req.user.id, // From auth middleware
        imageUrl
    };
    
    // Create course using repository
    const course = await courseRepository.createCourse(courseData);
    
    res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
    });
});

/**
 * Update course
 * @route PUT /api/courses/:code
 * @access Private (Instructors, Admins)
 */
exports.updateCourse = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const updateData = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Course code is required' });
    }
    
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No update data provided' });
    }
    
    // Find course by code
    const course = await courseRepository.findByCode(code);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Handle empty instructor ID (convert empty string to null)
    if (updateData.instructorId === '') {
        updateData.instructorId = null;
    }
    
    // Check if user is instructor for this course or an admin
    if (
        course.instructorId && course.instructorId.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return res.status(403).json({ error: 'Not authorized to update this course' });
    }
    
    // Update course using repository
    const updatedCourse = await courseRepository.updateCourse(course._id, updateData);
    
    res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: updatedCourse
    });
});

/**
 * Delete course
 * @route DELETE /api/courses/:code
 * @access Private (Instructors, Admins)
 */
exports.deleteCourse = asyncHandler(async (req, res) => {
    const { code } = req.params;
    
    if (!code) {
        return res.status(400).json({ error: 'Course code is required' });
    }
    
    // Find course by code
    const course = await courseRepository.findByCode(code);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if user is instructor for this course or an admin
    if (
        course.instructorId && course.instructorId.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return res.status(403).json({ error: 'Not authorized to delete this course' });
    }
    
    // Delete course using repository
    await courseRepository.deleteCourse(course._id);
    
    res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
    });
});

/**
 * Enroll student in course
 * @route POST /api/courses/:code/enroll
 * @access Private (Students)
 */
exports.enrollStudentInCourse = asyncHandler(async (req, res) => {
    const { code } = req.params;
    
    if (!code) {
        return res.status(400).json({ error: 'Course code is required' });
    }
    
    // Find course by code
    const course = await courseRepository.findByCode(code);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if user is a student
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Only students can enroll in courses' });
    }
    
    // Enroll student in course using repository
    try {
        await courseRepository.enrollStudent(req.user.id, course._id, code);
        
        res.status(200).json({
            success: true,
            message: 'Successfully enrolled in course'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Admin enrolls student in course
 * @route POST /api/courses/:code/admin-enroll
 * @access Private (Admin)
 */
exports.adminEnrollStudent = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const { studentId } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Course code is required' });
    }
    
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }
    
    // Check if user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only administrators can use this endpoint' });
    }

    // Find course by code
    const course = await courseRepository.findByCode(code);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    // Check if student is already enrolled
    try {
        await courseRepository.enrollStudent(studentId, course._id, code);
        
        res.status(200).json({
            success: true,
            message: 'Student successfully enrolled in course'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Unenroll student from course
 * @route DELETE /api/courses/:code/enroll
 * @access Private (Students)
 */
exports.unenrollStudentFromCourse = asyncHandler(async (req, res) => {
    const { code } = req.params;
    
    if (!code) {
        return res.status(400).json({ error: 'Course code is required' });
    }
    
    // Find course by code
    const course = await courseRepository.findById(code);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if user is a student
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Only students can unenroll from courses' });
    }
    
    // Unenroll student from course using repository
    const result = await courseRepository.unenrollStudent(req.user.id, course._id);
    
    if (!result) {
        return res.status(400).json({ error: 'You are not enrolled in this course' });
    }
    
    res.status(200).json({
        success: true,
        message: 'Successfully unenrolled from course'
    });
});

/**
 * Admin unenrolls student from course
 * @route DELETE /api/courses/:code/admin-enroll
 * @access Private (Admin)
 */
exports.adminUnenrollStudent = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const { studentId } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Course code is required' });
    }
    
    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }
    
    // Check if user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only administrators can use this endpoint' });
    }
    
    // Find course by code
    const course = await courseRepository.findByCode(code);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    // Find enrollment and delete it
    const enrollment = await Enrollment.findOne({ 
        userId: studentId, 
        courseId: course._id 
    });
    
    if (!enrollment) {
        return res.status(400).json({ error: 'Student is not enrolled in this course' });
    }
    
    await Enrollment.findByIdAndDelete(enrollment._id);
    
    // Remove student from enrolledStudents array if it exists
    if (course.enrolledStudents && course.enrolledStudents.includes(studentId)) {
        course.enrolledStudents = course.enrolledStudents.filter(id => 
            id.toString() !== studentId.toString()
        );
        await course.save();
    }
    
    res.status(200).json({
        success: true,
        message: 'Student successfully unenrolled from course'
    });
});

/**
 * Get enrolled students for a course
 * @route GET /api/courses/:code/students
 * @access Private (Instructors, Admins)
 */
exports.getEnrolledStudents = asyncHandler(async (req, res) => {
    const { code } = req.params;
    
    if (!code) {
        return res.status(400).json({ error: 'Course code is required' });
    }
    
    // Find course by code
    const course = await courseRepository.findByCode(code);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if user is instructor for this course or an admin
    if (
        course.instructorId && course.instructorId.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return res.status(403).json({ error: 'Not authorized to view enrolled students' });
    }
    
    // Get enrolled students using repository
    const enrollments = await courseRepository.getEnrolledStudents(course._id);
    
    res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
    });
});

/**
 * Get courses for a student
 * @route GET /api/courses/enrolled
 * @access Private (Students)
 */
exports.getStudentCourses = asyncHandler(async (req, res) => {
    // Check if user is a student
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Only students can access enrolled courses' });
    }
    
    // Get student courses using repository
    const courses = await courseRepository.getStudentCourses(req.user.id);
    
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, requireRoles } = require('../middleware/auth');

// Public routes
router.get('/', courseController.getAllCourses);
// Parameterized routes (This was a protected route!)
router.get('/:code', courseController.getCourseByCode);

// Protected routes
router.use(verifyToken);

// Student routes - specific routes before parameterized routes
router.get('/enrolled', requireRoles(['student']), courseController.getStudentCourses);

// // Parameterized routes
// router.get('/:code', courseController.getCourseByCode);

// Instructor/Admin routes
router.post('/', requireRoles(['instructor', 'admin']), courseController.addCourse);
router.put('/:code', requireRoles(['instructor', 'admin']), courseController.updateCourse);
router.delete('/:code', requireRoles(['instructor', 'admin']), courseController.deleteCourse);
router.get('/:code/students', requireRoles(['instructor', 'admin']), courseController.getEnrolledStudents);

// Student enrollment routes
router.post('/:code/enroll', requireRoles(['student']), courseController.enrollStudentInCourse);
router.delete('/:code/enroll', requireRoles(['student']), courseController.unenrollStudentFromCourse);

module.exports = router;

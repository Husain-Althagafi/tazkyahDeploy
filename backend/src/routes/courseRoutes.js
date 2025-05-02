const express = require('express')
const courseController = require('../controllers/courseController.js')
const {verifyToken, requireRoles} = require('../middleware/auth.js')

const router = express.Router()

//Get all courses
router.get('/', courseController.getAllCourses)

//Get a course from its code
router.get('/courses/:code', courseController.getCourseByCode);

//Add a course
router.post('/', verifyToken, requireRoles(['admin', 'instructor']), courseController.addCourse)

//Update course based on its code
router.put('/courses/:code', verifyToken, requireRoles(['admin', 'instructor']),courseController.updateCourse)

//Delete course based on its code
router.delete('/courses/:id', verifyToken, requireRoles(['admin', 'instructor']), courseController.deleteCourse)

//Can be moved to an enrollments route if needed

//Register student for course based on its code
router.post('/enrollments/:code', courseController.enrollStudentInCourse)

//Remove student from course based on its code
router.delete('/enrollments/:code', courseController.unenrollStudentFromCourse)

//Add intructor to course

//Remove instructor from course


module.exports = router 
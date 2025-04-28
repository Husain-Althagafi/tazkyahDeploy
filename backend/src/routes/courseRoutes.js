const express = require('express')
const courseController = require('../controllers/courseController.js')
const {verifyToken, requireRoles} = require('../middleware/auth.js')

const router = express.Router()

//Get all courses with /api/courses/
router.get('/', verifyToken, requireRoles(['admin']), courseController.getAllCourses)

//Get courses with /api/courses?id={id}
router.get('/:code', verifyToken, requireRoles(['admin']), courseController.getCourseByCode);

//Add a course
router.post('/', verifyToken, requireRoles(['admin']), courseController.addCourse)

//Update course
router.put('/:code', courseController.updateCourse)

//Delete course
router.delete('/:id', courseController.deleteCourse)


/////Everything below this might be changed, we might implement it within an enrollments.js route instead

//Register student for course
router.post('/enroll/:code', courseController.enrollStudentInCourse)

//Remove student from course

//Add intructor to course

//Remove instructor from course


module.exports = router 
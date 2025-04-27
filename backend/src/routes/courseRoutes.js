const express = require('express')
const courseController = require('../controllers/courseController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router()

//Get all courses with /api/courses/
router.get('/', verifyToken, requireRole('admin'), courseController.getAllCourses)

//Get courses with /api/courses?id={id}
router.get('/:code', verifyToken, requireRole('admin'), courseController.getCourseByCode);

//Add a course
router.post('/', verifyToken, requireRole('admin'), courseController.addCourse)

//Update course
// router.put('/:id', courseController.updateCourse)

//Delete course
// router.delete('/:id', courseController.deleteCourse)


/////Everything below this might be changed, we might implement it within an enrollments.js route instead


//Register student for course

//Remove student from course

//Add intructor to course

//Remove instructor from course


module.exports = router 
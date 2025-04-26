const express = require('express')
const courseController = require('../controllers/courseController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router()

// router.get('/')


module.exports = router


// My original code 

// const express = require('express');
// const { getAllCourses } = require('../controllers/courseController');
// const router = express.Router();

// // Route to get all courses
// router.get('/', getAllCourses); // If user is in / endpoint, it will call the getAllCourses function
// // '/' is replaced by /api/courses in the server.js file
// // This means that when a GET request is made to /api/courses, the getAllCourses function will be called
// module.exports = router;
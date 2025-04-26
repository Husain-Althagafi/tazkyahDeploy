// Husain code
const express = require('express')
const { getAllCourses } = require('../controllers/courseController');
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router() // If we didn't use express.Router(), we would have to use app.get() instead of router.get()
// If this code were in the same file as the server.js file, we would have to use app.get() instead of router.get()
// This is because app.get() is a method of the express application object, while router.get() is a method of the router object

// Route to get all courses
router.get('/', getAllCourses); // If user is in / endpoint, it will call the getAllCourses function
// '/' is replaced by /api/courses in the server.js file
// This means that when a GET request is made to /api/courses, the getAllCourses function will be called
module.exports = router;
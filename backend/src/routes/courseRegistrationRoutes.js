const express = require('express');
const { registerStudent } = require('../controllers/courseRegistrationController');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// Route to register a student for a course
router.post('/:courseId/register', verifyToken, requireRole('student'), registerStudent);

module.exports = router;
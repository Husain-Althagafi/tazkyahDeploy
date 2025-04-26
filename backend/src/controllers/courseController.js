// fetch all courses from the database to show in the courses page
const Course = require('../models/Course');
const asyncHandler = require('../middleware/asyncHandler.js')


// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find(); // Fetch all courses from the database
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

module.exports = { getAllCourses };


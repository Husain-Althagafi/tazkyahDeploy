// fetch all courses from the database to show in the courses page
const Course = require('../models/Course');
const asyncHandler = require('../middleware/asyncHandler.js')


// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find(); // Fetch all courses from the database
        console.log('Courses fetched:', courses); // Debug log
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error.message); // Debug log
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

module.exports = { getAllCourses };


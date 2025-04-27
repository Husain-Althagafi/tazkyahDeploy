const CourseModel = require('../models/Course.js')
const asyncHandler = require('../middleware/asyncHandler.js')

exports.getAllCourses = asyncHandler(async (req, res) => {
    const courses = await CourseModel.find()

    res.status(200).json({
        count: courses.length,
        data: courses
    })
})


exports.getCourseByCode = asyncHandler (async (req, res) => {
    const code = req.params.code

    if (!code) {
        return res.status(400).json({error: 'error fetching course'})
    }

    const course = await CourseModel.findOne({code: code})

    if (!course) {
        return res.status(400).json({error: 'Course not found'})
    }

    return res.status(200).json(course)
    
})

exports.addCourse = asyncHandler(async (req, res) => {
    const {title, code, description} = req.body

    const courseExists = await CourseModel.findOne({title: title})

    if (courseExists) {
        return res.status(400).json({error: 'Course already exists with this name'})
    }

    const course = await CourseModel.create({
        title, code, description
    })

    return res.json({
        message: 'Course created',
        course: {
            id: course._id,
            code: course.code,
            title: course.title,
            description: course.description
        }
    }) 
})
const CourseModel = require('../models/Course.js')
const asyncHandler = require('../middleware/asyncHandler.js')

exports.getAllCourses = asyncHandler(async (req, res) => {
    const courses = await CourseModel.find()

    res.status(200).json({
        count: courses.length,
        data: courses
    })
})


exports.addCourse = asyncHandler(async (req, res) => {
    const {title, description} = req.body

    const courseExists = await CourseModel.findOne({title: title})

    if (courseExists) {
        return res.status(400).json({error: 'Course already exists with this name'})
    }

    const course = await CourseModel.create({
        title, description
    })

    return res.json({
        message: 'Course created',
        course: {
            id: course._id,
            title: course.title,
            description: course.description
        }
    }) 
})
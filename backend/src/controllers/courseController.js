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

    const course = await CourseModel.findOne({code: code}).select('-__v')

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


exports.updateCourse = asyncHandler (async (req, res) => {
    const {code} = req.params
    const updatedData = req.body

    if (!code) {
        return res.status(400).json({error: 'No code provided'})
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).json({error: 'No update data provided'})
    }

    const restrictedFields = [
        'enrolledStudents',
        'instructor',
        'resources'
    ]
    for (const field of restrictedFields) {
        if (updatedData[field]) {
            return res.status(400).json({error: 'Can not update restricted fields'})
        }
    }

    const updatedCourse = await CourseModel.findOneAndUpdate(
        {code: code},
        updatedData,
        {
            new: true,
            runValidators: true
        }
    ).select('-__v')

    return res.status(200).json(updatedCourse)
})


exports.deleteCourse = asyncHandler (async (req, res) => {
    const {code} = req.params
        if (!code) {
            return res.status(400).json({error: 'Error deleting course'})
        }
        const course = await CourseModel.findOneAndDelete({code : code})
    
        if (!code) {
            return res.status(400).json({error: 'Course doesnt exist'})
        }
    
        res.status(200).json({
            message: 'Course deleted successfully' 
        })
})
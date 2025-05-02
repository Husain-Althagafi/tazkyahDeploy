const CourseModel = require('../models/Course.js')
const UserModel = require('../models/User.js')

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
    const code = req.params.code
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
    const code = req.params.code
        if (!code) {
            return res.status(400).json({error: 'Error deleting course'})
        }
        const course = await CourseModel.findOneAndDelete({code : code})
    
        if (!course) {
            return res.status(400).json({error: 'Course doesnt exist'})
        }

        //Handle deleting a course that has users enrolled
        await UserModel.updateMany(
            {enrolledCourses: code},
            {$pull: {enrolledCourses: code}}
        )
    
    
        res.status(200).json({
            message: 'Course deleted successfully' 
        })
})


exports.enrollStudentInCourse = asyncHandler (async (req, res) => {
    const code = req.params.code

    if (!code) {
        return res.status(400).json({error: 'No code supplied'})
    }

    const {firstName, lastName, email, phone} = req.body

    const user = await UserModel.findOne({email: email}).select('-password -__v')
    const course = await CourseModel.findOne({code: code})

    if (!user) {
        return res.status(400).json({error: "This email does not belong to a user"})
    }

    if (!course){
        return res.status(400).json({error: 'This code doesnt correspond to an existing course'})
    }

    if (user.role != 'student') {
        return res.status(400).json({error: 'Only students can enroll in courses'})
    }

    const alreadyEnrolled = course.enrolledStudents.includes(user._id)

    if (alreadyEnrolled) {
        return res.status(400).json({error: 'This student is already enrolled in this course'})
    }

    course.enrolledStudents.push(user._id)
    await course.save()

    user.enrolledCourses.push(course._id)
    await user.save()

    return res.status(200).json({message: 'Student enrolled in course successfully'})

})


exports.unenrollStudentFromCourse = asyncHandler(async (req, res) => {
    const code = req.params.code

    if (req.user.role === 'student') {
        const user_id = req.user._id
        const user = await UserModel.findById(user_id)
    }

    else if (req.user.role === 'instructor' || req.user.role === 'admin'){
        const user_id = req.body.email
        const user = await UserModel.findOne({email: user_id})
    }

    if (!code || !user_id) {
        return res.status(400).json({error: 'Missing params'})
    }

    
    if (user.role !== 'student') {
        return res.status(400).json({error: 'This user is not a student'})
    }

    const course = await CourseModel.findOne({code: code})

    if (!course) {
        return res.status(400).json({error: 'Course does not exist'})
    }

    const alreadyEnrolled = course.enrolledStudents.includes(user._id)

    if (!alreadyEnrolled) {
        return res.status(400).json({error: 'User is not enrolled in the course'})
    }

    course.enrolledStudents = course.enrolledStudents.filter(
        (studentId) => studentId !== user._id
    )

    await course.save()

    const inCourse = user.enrolledCourses.includes(course._id)

    if (!inCourse) {
        return res.status(400).json({error: 'User is not enrolled in the course'})
    }

    /// these is a current circumstance where the user may be in the courses list of enrolled student but for some reason not have the course in his own enrolled courses list. vice versa is also possible. for now ignore

    user.enrolledCourses = user.enrolledCourses.filter(
        (courseId) => courseId !== course._id
    )

    await user.save()
    
    return res.status(200).json({
        message: 'User removed from course',
        data: {
            user: user.enrolledCourses,
            course: course.enrolledStudents
        }
    })
})
const UserModel = require('../models/User.js')
const CourseModel = require('../models/Course.js')
const asyncHandler = require('../middleware/asyncHandler.js')


exports.getAllUsers = asyncHandler (async (req, res) => {
    const users = await UserModel.find().select('-password -__v')

    res.status(200).json({
        success:true,
        count:users.length,
        data:users
    })
})


exports.getUserByEmail = asyncHandler (async (req, res) => {
    const email = req.params.email

    if (!email) {
        return res.status(400).json({error: 'error fetching user'})
    }

    const user = await UserModel.findOne({email: email}).select('-password -__v')

    if (!user) {
        return res.status(400).json({error: 'User not found'})
    }

    return res.status(200).json(user)
    
})


exports.addUser = asyncHandler (async (req, res) => {
    const {username, email, password, role} = req.body

    if (!username || !email || !password){
        return res.status(400).json({message:'User info needed'})
    }

    const userExists = await UserModel.findOne({email: email})

    if (userExists) {
        return res.status(400).json({error: 'Email already exists'})
    }
    
    const user = await UserModel.create({
        username, email, password, role
    })

    return res.json({
        message: 'User created',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

})


exports.updateUser = asyncHandler (async (req, res) => {
    const {email} = req.params
    const updatedData = req.body

    if (!email) {
        return res.status(400).json({error: 'No email provided'})
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).json({error: 'No update data provided'})
    }

    const restrictedFields = [
        '_id',
        'password',
        'createdAt'
    ]
    for (const field of restrictedFields) {
        if (updatedData[field]) {
            return res.status(400).json({error: 'Can not update restricted fields'})
        }
    }

    const updatedUser = await UserModel.findOneAndUpdate(
        {email: email},
        updatedData,
        {
            new: true,
            runValidators: true
        }
    ).select('-password -__v')

    return res.status(200).json(updatedUser)
})


exports.deleteUser = asyncHandler (async (req, res) => {
    const {email} = req.params
    if (!email) {
        return res.status(400).json({error: 'Error deleting user'})
    }
    const user = await UserModel.findOneAndDelete({email : email})

    if (!user) {
        return res.status(400).json({error: 'User doesnt exist'})
    }

    //Handle instructor deletion
    await CourseModel.updateMany(
        {instructor: user._id},
        {$set : {instructor: null}}
    )

    //Handle enrolled student deletion
    await CourseModel.updateMany(
        {enrolledStudents: user._id},
        {$pull: {enrolledStudents: user._id}}
    )

    res.status(200).json({
        message: 'user deleted successfully' 
    })

})


exports.updateUserProfile = asyncHandler( async(req, res) => {
    const profile = req.body

    if (!profile || Object.keys(profile).length === 0) {
        return res.status(400).json({error: 'No changes provided'})
    }

    const user = await UserModel.findById(req.user._id)

    if (!user) {
        return res.status(404).json({error: 'User doesnt exist'})
    }

    const updates = {
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        'profile.bio': profile.bio,
        'profile.birthDate': profile.birthDate,
    }

    Object.keys(updates).forEach(key => {
        if (updates[key] === null) {
            delete updates[key]
        }
    })

    const updatedUser = await UserModel.findOneAndUpdate(
        {_id: req.user._id},
        {$set: updates},
        {new: true, runValidators: true}
    ).select('-password -__v')

    return res.status(200).json({
        message: 'Updated user profile',
        data: updatedUser
    })
})



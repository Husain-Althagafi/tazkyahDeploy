// Handles user-related operations, such as fetching all users or a specific user by ID.
// Uses the User model to query the database.

const UserModel = require('../models/User.js')
const asyncHandler = require('../middleware/asyncHandler.js')

exports.getAllUsers = asyncHandler (async (req, res) => {
    const users = await UserModel.find().select('-password -__v')

    res.status(200).json({
        success:true,
        count:users.length,
        data:users
    })
})


exports.getUserById = asyncHandler (async (req, res) => {
    const user = await UserModel.find().select('-password -__v')
})
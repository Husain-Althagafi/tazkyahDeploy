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
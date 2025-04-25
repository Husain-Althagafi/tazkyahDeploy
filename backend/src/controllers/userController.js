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


exports.getUserByEmail = asyncHandler (async (req, res) => {
    const email = req.query.email

    if (!email) {
        res.status(400).json({error: 'error fetching user'})
    }

    const user = await UserModel.findOne({email: email}).select('-password -__v')

    if (!user) {
        res.status(400).json({error: 'User not found'})
    }

    res.status(200).json(user)
    
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





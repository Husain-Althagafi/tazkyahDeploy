const UserModel = require('../models/User.js')
const asyncHandler = require('../middleware/asyncHandler.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

//need to add role as an attribute
exports.register = asyncHandler ( async(req, res, next) => {
    const {username, email, password} = req.body
   
    if (!username || !email || !password){
        return res.status(400).json({message:'Please provide username, email, and password'})
    }

    const userExists = await UserModel.findOne({email: email})

    if (userExists) {
        return res.status(400).json({error: 'Email already exists'})
    }

    const user = await UserModel.create({
        username, email, password
    })

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '1h'}// can set to value in .env
    )

    return res.json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
})

exports.login = asyncHandler (async (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password){
        return res.status(400).json({message:'Please provide username and password'})
    }

    const user = await UserModel.findOne({username}).select('password')

    if (!user) {
        return res.status(401).json({message: 'invalid email or password'})
    }


    return res.status(200).json({message: 'User logged in successfully'})
    
})



require('dotenv').config({path: '../.env'})

//Imports
const UserModel = require('../models/User.js')
const asyncHandler = require('../middleware/asyncHandler.js')
const jwt = require('jsonwebtoken')


//need to add role as an attribute
//Register controller
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
        process.env.JWT_SECRET,         //add role later
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


//Login controller
exports.login = asyncHandler (async (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password){
        return res.status(400).json({message:'Please provide username and password'})
    }

    const user = await UserModel.findOne({username: username}).select('+password')

    if (!user) {
        return res.status(400).json({error: 'Invalid email or password'})
    }

    const validPass = await user.comparePassword(password)

    if (!validPass) {
        return res.status(400).json({error: 'Invalid email or password'})
    }

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}   //add role later
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



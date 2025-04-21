require('dotenv').config({path: '../.env'})

//Imports
const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
const asyncHandler = require('./asyncHandler.js')

//auth middleware
const auth = asyncHandler( async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return res.status(400).json({error: 'No token authorization denied'})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await UserModel.findById(decoded.id)

    if (!user) {
        return res.status(400).json({error: 'Invalid token'})
    }

    req.user = user

    next()
})

module.exports = auth
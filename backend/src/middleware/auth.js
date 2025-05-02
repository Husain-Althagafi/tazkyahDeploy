require('dotenv').config({path: '../.env'})

//Imports
const jwt = require('jsonwebtoken')
const UserModel = require('../models/User.js')
const asyncHandler = require('./asyncHandler.js')

//auth middleware
exports.verifyToken = asyncHandler( async (req, res, next) => {
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


exports.requireRoles = (roles) => {
    return (req, res, next) => {
        if (req.user) {
            if (!roles.includes(req.user.role)) {
                console.log(req.user.role)
                return res.status(400).json({error: 'Access denied'})
            }
            next()
        }
        
    }
}


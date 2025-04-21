const UserModel = require('../models/User.js')
const asyncHandler = require('../middleware/asyncHandler.js')


//need to add role as an attribute
exports.register = asyncHandler ( async(req, res, next) => {
    const {username, email, password} = req.body
   
    if (!username || !email || !password){
        return res.status(400).json({message:'Please provide username, email, and password'})
    }

    

    const user = await UserModel.create({
        username, email, password
    })

    return res.status(200).json({message:'User registered successfully'})
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



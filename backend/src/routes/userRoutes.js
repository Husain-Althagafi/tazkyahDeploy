const express = require('express')
const userController = require('../controllers/userController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router()

//Get all users with /api/users/
//Get user with /api/users?email={email}
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
    if (req.query.email){
        return userController.getUserByEmail(req, res)
    }
    return userController.getAllUsers
})

//Add a user
router.post('/', verifyToken, requireRole('admin'), userController.addUser)

// router.put('/:username')//update user

// router.delete('/:username')//delete user



module.exports = router 
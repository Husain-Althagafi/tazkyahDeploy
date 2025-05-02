const express = require('express')
const userController = require('../controllers/userController.js')
const {verifyToken, requireRoles} = require('../middleware/auth.js')

const router = express.Router()

//Get all users with /api/users/
router.get('/', verifyToken, requireRoles(['admin']), userController.getAllUsers);

//Get user with /api/users?email={email}
router.get('/email/:email', verifyToken, requireRoles(['admin']), userController.getUserByEmail);

//Add a user
router.post('/', verifyToken, requireRoles(['admin']), userController.addUser)

//Update user
router.put('email/:email', verifyToken, requireRoles(['admin']), userController.updateUser)

//Delete user
router.delete('/email/:email', verifyToken, requireRoles(['admin']), userController.deleteUser)

//Update user profile
router.put('/profile', verifyToken, userController.updateUserProfile)

module.exports = router 
const express = require('express')
const userController = require('../controllers/userController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router()

//Get all users with /api/users/
router.get('/', verifyToken, requireRole('admin'), userController.getAllUsers);

//Get user with /api/users?email={email}
router.get('/:email', verifyToken, requireRole('admin'), userController.getUserByEmail);

//Add a user
router.post('/', verifyToken, requireRole('admin'), userController.addUser)

//Update user
router.put('/:email', verifyToken, requireRole('admin'), userController.updateUser)

//Delete user
router.delete('/:email', verifyToken, requireRole('admin'), userController.deleteUser)


module.exports = router 
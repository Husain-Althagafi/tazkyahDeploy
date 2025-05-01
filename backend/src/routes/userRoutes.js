const express = require('express')
const userController = require('../controllers/userController.js')
const {verifyToken, requireRoles} = require('../middleware/auth.js')

const router = express.Router()

//Get all users with /api/users/
router.get('/', verifyToken, requireRoles(['admin']), userController.getAllUsers);

//Get user with /api/users?email={email}
router.get('/:email', verifyToken, requireRoles(['admin']), userController.getUserByEmail);

//Add a user
router.post('/', verifyToken, requireRoles(['admin']), userController.addUser)

//Update user
router.put('/:email', verifyToken, requireRoles(['admin']), userController.updateUser)

//Delete user
router.delete('/:email', verifyToken, requireRoles(['admin']), userController.deleteUser)

module.exports = router 
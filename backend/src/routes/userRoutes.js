const express = require('express')
const userController = require('../controllers/userController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router()

router.get('/', verifyToken, requireRole('admin'), userController.getAllUsers)// get all users

router.get('/:username', verifyToken, requireRole('admin', userController.getUserById))//get user

router.post('/')//create user

router.put('/:username')//update user

router.delete('/:username')//delete user



module.exports = router 
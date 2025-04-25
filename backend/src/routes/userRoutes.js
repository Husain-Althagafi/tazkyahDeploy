const express = require('express')
const userController = require('../controllers/userController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router()

router.get('/', verifyToken, requireRole('admin'), userController.getAllUsers)// get all users

router.get('/:id', verifyToken, requireRole('admin', userController.getUserById))



module.exports = router 
const express = require('express')
const adminController = require('../controllers/adminController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router()

router.get('/', verifyToken, requireRole('admin'),adminController.getAllUsers)// get all users



module.exports = router 
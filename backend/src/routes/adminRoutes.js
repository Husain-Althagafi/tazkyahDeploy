const express = require('express')

const router = express.Router()
const adminController = require('../controllers/adminController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

router.get('/users', verifyToken, requireRole('admin'),adminController.getAllUsers)


module.exports = router 
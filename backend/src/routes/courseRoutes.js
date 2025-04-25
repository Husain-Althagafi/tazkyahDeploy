const express = require('express')
const courseController = require('../controllers/courseController.js')
const {verifyToken, requireRole} = require('../middleware/auth.js')

const router = express.Router()

// router.get('/')


module.exports = router
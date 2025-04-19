const express = require('express')
const router = express.Router()

router.post('/register', (req, res) => {
    try {

    }
    catch (error) {
        res.status(500).json({message:"error registering"})
    }
})

router.post('/login', (req, res) => {
    try {

    }
    catch (error) {
        res.status(500).json({message:"error logging in"})
    }
})


module.exports = router
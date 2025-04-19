require('dotenv').config({path: './.env'})
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth.js')

const PORT = process.env.PORT
const studentsPath = './models/students.json'
//App
const app = express()

//Database
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27107', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('Mongodb connected!'))
.catch(err => console.log('Connection error:', err))

//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)

//Listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

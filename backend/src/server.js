//Imports
require('dotenv').config({path: './.env'})

//middleware
const express = require('express')
const cors = require('cors')

// Register routes
// Without registering the routes, the server won't know how to handle requests to those endpoints
const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const courseRoutes = require('./routes/courseRoutes');


//env
const PORT = process.env.PORT

//App
const app = express()

//Database
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('Mongodb connected!'))
.catch(err => console.log('Connection error:', err))

//Middleware
app.use(cors())
app.use(express.json())

//Routes
// .use() is a method in Express that mounts middleware functions to a specific path.
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/courses', courseRoutes);


//Error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({error: 'Something went wrong!'})
})

//Listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

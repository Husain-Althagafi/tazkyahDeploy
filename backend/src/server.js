//Imports
require('dotenv').config({path: './.env'})

//middleware
const express = require('express')
const cors = require('cors')

//routes
const authRoutes = require('./routes/authRoutes.js')
const adminRoutes = require('./routes/adminRoutes.js')



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
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

//Listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

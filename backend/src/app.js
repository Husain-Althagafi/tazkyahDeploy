// backend/src/app.js
require('dotenv').config({path: './.env'})

//middleware
const express = require('express')
const cors = require('cors')
const path = require('path')

//routes
const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const courseRoutes = require('./routes/courseRoutes.js')
const resourceRoutes = require('./routes/resourceRoutes.js')
const personRoutes = require("./routes/personRoutes.js")

//App
const app = express()

//Database
const connectDB = require("./config/db.js");

connectDB();

//Middleware
app.use(cors())
app.use(express.json())

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use("/api/persons", personRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/resources', resourceRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tazkyah API" });
});

//Error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({error: err.message || 'Something went wrong!'})
})

// Export the app instead of calling listen
module.exports = app;
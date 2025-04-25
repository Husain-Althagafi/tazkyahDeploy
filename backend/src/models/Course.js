//Imports
const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: String,
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.Model('Course', CourseSchema)
//Imports
const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    code: {
        type: String,
        required: true,
        unique: true,
    },

    description: String,

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    resources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },

    courseStatus: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available'

    },
    imgPath: {
        type: String,
        default: '../../src/images/React.png'
    },

})

module.exports = mongoose.model('Course', CourseSchema)
//Imports
const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    status: {
        type: String,
        enum: ['active', 'inactive', 'upcoming'],
        default: 'upcoming'
    },
    enrollmentCapacity: {
        type: Number,
        default: 30
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    courseStatus: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available'

    },
    img: {
        type: String,
        default: '/images/React.png'
    },

    courseModernity: {
        type: String,
        enum: ['New', 'Old'],
        default: 'New'
    },
    
})


// Create Indexes
CourseSchema.index({ code: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ instructorId: 1 });

module.exports = mongoose.model('Course', CourseSchema);

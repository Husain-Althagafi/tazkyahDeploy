const mongoose = require('mongoose')

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
    },

    course: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    fileType: String,

    uploadedAt: {
        type: Date,
        default: Date.now
    },

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
})

module.exports = mongoose.model('Resource', ResourceSchema)
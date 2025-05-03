const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Create indexes for performance
ResourceSchema.index({ courseId: 1 });
ResourceSchema.index({ uploadedBy: 1 });
ResourceSchema.index({ fileType: 1 });

module.exports = mongoose.model('Resource', ResourceSchema);
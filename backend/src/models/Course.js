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

module.exports = mongoose.model('Course', CourseSchema, 'Course')
// .model() is a method that creates a model from the schema and exports it.
// The model is used to interact with the database and perform CRUD operations on the data.
// The model is created using the mongoose.model() method, which takes two arguments: 
// the name of the model and the schema to use for the model. 
// The name of the model is used to create the collection in the database. 
// The schema defines the structure of the data in the collection. 
// The model is then exported using module.exports so that it can be used in other parts of the application.

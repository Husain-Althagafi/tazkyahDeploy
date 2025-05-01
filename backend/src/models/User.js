//Imports
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


//User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
    },

    firstName : {
        type: String, 
        required: true    
    },

    lastName: {
        type: String,
        required: true
    },

    email : {
        type: String, 
        required: [true, 'Please provide an email'], 
        unique: true, 
        lowercase: true, 
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
      
    },

    password : {
        type: String, 
        required: [true, 'Please provide a password']
    },

    createdAt : {
        type: Date,
        default: Date.now
    },

    role: {
        type: String,
        enum: ['admin', 'student', 'instructor'],
        default: 'student'
        
    },

    enrolledCourses: [{
        type : mongoose.Schema.Types.ObjectId, ref: "Course"
    }],

    phoneNumber: {
        type: String
    },

    profile: {
        bio: {
            type: String,
            maxLength: 500
        },
    
        birthDate: Date,

        profilePic: String,
    }
})


//When password is changed/added it is hashed before storing
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


//Helper method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  
module.exports = mongoose.model('User', UserSchema)
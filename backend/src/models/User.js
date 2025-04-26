//Imports
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


//User Schema
const UserSchema = new mongoose.Schema({
    username : {
        type: String, 
        required: [true, 'Please provide a username']     
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
        enum: ['admin', 'student', 'instructor']
    }
})


//When password is changed/added it is hashed before storing
// We do this because we do not want to store the password in plain text
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


//Helper method to compare password
// This is used to compare the password entered by the user with the hashed password stored in the database
// This is used in the login controller to check if the password entered by the user is correct
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };


module.exports = mongoose.model('User', UserSchema)
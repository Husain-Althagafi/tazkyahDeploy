//Imports
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


//User Schema
const UserSchema = new mongoose.Schema({
    username : {
        type: String, 
        required: [true, 'Please provide a username'],
        unique: true    //should change this from being true but for now its fine (username does not need to be unqiue)
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
    }

    // role: {
    // type: String
    //}
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
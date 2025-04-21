const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

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
    }

    // role: {
    // type: String
    //}
})

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };






module.exports = mongoose.model('User', UserSchema)
//Imports
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


//User Schema
const UserSchema = new mongoose.Schema({
    personId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student",
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
});

// Create virtual for full name
UserSchema.virtual('person', {
    ref: 'Person',
    localField: 'personId',
    foreignField: '_id',
    justOne: true
});

//When password is changed/added it is hashed before storing
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});


//Helper method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
UserSchema.index({ personId: 1 });
UserSchema.index({ role: 1 });

  
module.exports = mongoose.model('User', UserSchema)
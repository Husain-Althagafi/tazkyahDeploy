const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });
        console.log('Connecting to:', process.env.MONGO_URL);
        console.log('MongoDB connected!');
    } catch (error) {
        console.error('Connection error:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;


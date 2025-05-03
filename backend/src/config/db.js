const mongoose = require('mongoose');

// Define connection function
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Set up connection error handler
        mongoose.connection.on('error', err => {
            console.error(`MongoDB connection error: ${err}`);
        });
        
        // Handle disconnection
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected, attempting to reconnect...');
        });
        
        // Handle reconnection
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        
        // Handle application termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
        
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB

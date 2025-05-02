// backend/src/utils/seeder.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Person = require('../models/Person');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected!');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Clear database
const clearDB = async () => {
    if (process.env.NODE_ENV === 'production') {
        console.log('Cannot clear database in production mode');
        return;
    }
    
    try {
        await Person.deleteMany({});
        await User.deleteMany({});
        await Course.deleteMany({});
        await Enrollment.deleteMany({});
        
        console.log('Database cleared');
    } catch (error) {
        console.error(`Error clearing database: ${error.message}`);
        process.exit(1);
    }
};

// Seed database
const seedDB = async () => {
    try {
        // Create admin person
        const adminPerson = new Person({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@tazkyah.org',
            phoneNumber: '+966123456789',
            createdAt: new Date(),
            lastLogin: new Date()
        });
        await adminPerson.save();
        
        // Create admin user
        const adminUser = new User({
            personId: adminPerson._id,
            role: 'admin',
            passwordHash: 'admin123' // Will be hashed by pre-save middleware
        });
        await adminUser.save();
        
        // Create instructor person
        const instructorPerson = new Person({
            firstName: 'Instructor',
            lastName: 'User',
            email: 'instructor@tazkyah.org',
            phoneNumber: '+966123456788',
            createdAt: new Date(),
            lastLogin: new Date()
        });
        await instructorPerson.save();
        
        // Create instructor user
        const instructorUser = new User({
            personId: instructorPerson._id,
            role: 'instructor',
            passwordHash: 'instructor123' // Will be hashed by pre-save middleware
        });
        await instructorUser.save();
        
        // Create student person
        const studentPerson = new Person({
            firstName: 'Student',
            lastName: 'User',
            email: 'student@tazkyah.org',
            phoneNumber: '+966123456787',
            createdAt: new Date(),
            lastLogin: new Date()
        });
        await studentPerson.save();
        
        // Create student user
        const studentUser = new User({
            personId: studentPerson._id,
            role: 'student',
            passwordHash: 'student123' // Will be hashed by pre-save middleware
        });
        await studentUser.save();
        
        // Create courses
        const courses = [
            {
                title: 'Introduction to Quran',
                code: 'QRN101',
                description: 'An introductory course to understanding the Quran',
                status: 'active',
                enrollmentCapacity: 30,
                startDate: new Date(),
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
                instructorId: instructorUser._id,
                imageUrl: 'https://placehold.co/600x400?text=Quran+101'
            },
            {
                title: 'Islamic Ethics',
                code: 'ETH201',
                description: 'Learn about Islamic ethics and moral values',
                status: 'active',
                enrollmentCapacity: 25,
                startDate: new Date(),
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
                instructorId: instructorUser._id,
                imageUrl: 'https://placehold.co/600x400?text=Ethics+201'
            },
            {
                title: 'Arabic for Beginners',
                code: 'ARB101',
                description: 'Learn basic Arabic language skills',
                status: 'upcoming',
                enrollmentCapacity: 20,
                startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
                instructorId: instructorUser._id,
                imageUrl: 'https://placehold.co/600x400?text=Arabic+101'
            }
        ];
        
        const savedCourses = [];
        for (const course of courses) {
            const savedCourse = new Course(course);
            await savedCourse.save();
            savedCourses.push(savedCourse);
        }
        
        // Enroll student in courses
        const enrollments = [
            {
                userId: studentUser._id,
                courseId: savedCourses[0]._id, // Quran 101
                progress: 30,
                enrollmentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                status: 'active'
            },
            {
                userId: studentUser._id,
                courseId: savedCourses[1]._id, // Ethics 201
                progress: 10,
                enrollmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                status: 'active'
            }
        ];
        
        for (const enrollment of enrollments) {
            const savedEnrollment = new Enrollment(enrollment);
            await savedEnrollment.save();
        }
        
        console.log('Database seeded successfully');
    } catch (error) {
        console.error(`Error seeding database: ${error.message}`);
        process.exit(1);
    }
};

// Main function
const main = async () => {
    // Connect to database
    await connectDB();
    
    // Clear and seed database
    await clearDB();
    await seedDB();
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed');
    process.exit(0);
};

// Run the script
main();
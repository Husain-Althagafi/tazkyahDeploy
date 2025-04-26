const registerStudent = async (req, res) => {
    try {
        const { courseId } = req.params; // Get course ID from the URL
        const userId = req.user._id; // Get the authenticated user's ID from req.user
        const { firstName, lastName, email, phoneNumber } = req.body; // Get form data from the request body

        // Validate the form data (optional)
        if (!firstName || !lastName || !email || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the student is already enrolled
        if (course.students.includes(userId)) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }

        // Add the student to the course
        course.students.push(userId);
        await course.save();

        res.status(200).json({ message: 'You have successfully registered for the course' });
    } catch (error) {
        console.error('Error registering student:', error.message);
        res.status(500).json({ message: 'An error occurred while registering for the course' });
    }
};
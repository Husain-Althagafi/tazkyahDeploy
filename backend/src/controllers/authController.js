const userRepository = require('../repositories/userRepository');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    // Check if user with email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create user data object
    const userData = {
        firstName,
        lastName,
        email,
        password,
        role: role || 'student'
    };
    
    // Create user using repository
    const user = await userRepository.createUser(userData);
    
    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, role: user.role, personId: user.personId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    res.status(201).json({
        success: true,
        token,
        user: {
            id: user._id,
            firstName: user.person.firstName,
            lastName: user.person.lastName,
            email: user.person.email,
            role: user.role
        }
    });
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    // Authenticate user using repository
    const user = await userRepository.authenticateUser(email, password);
    
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, role: user.role, personId: user.personId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            firstName: user.person.firstName,
            lastName: user.person.lastName,
            email: user.person.email,
            role: user.role
        }
    });
});

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = asyncHandler(async (req, res) => {
    const user = await userRepository.findById(req.user.id);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            firstName: user.person.firstName,
            lastName: user.person.lastName,
            email: user.person.email,
            role: user.role
        }
    });
});

/**
 * Refresh token
 * @route POST /api/auth/refresh-token
 * @access Private
 */
exports.refreshToken = asyncHandler(async (req, res) => {
    // Generate new JWT token
    const token = jwt.sign(
        { id: req.user.id, role: req.user.role, personId: req.user.personId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    res.status(200).json({
        success: true,
        token
    });
});
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production', {
        expiresIn: '30d'
    });
};

// Register new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, ...roleSpecificInfo } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists'
            });
        }

        // Create user object based on role
        const userData = {
            name,
            email,
            password,
            role
        };

        // Add role-specific information
        switch (role) {
            case 'student':
                if (!roleSpecificInfo.university || !roleSpecificInfo.major) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Please provide university and major for student registration'
                    });
                }
                userData.studentInfo = roleSpecificInfo;
                break;
            case 'company':
                if (!roleSpecificInfo.companyName || !roleSpecificInfo.industry) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Please provide company name and industry for company registration'
                    });
                }
                userData.companyInfo = roleSpecificInfo;
                break;
            case 'university':
                if (!roleSpecificInfo.institutionName || !roleSpecificInfo.location) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Please provide institution name and location for university registration'
                    });
                }
                userData.universityInfo = roleSpecificInfo;
                break;
            default:
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid role'
                });
        }

        // Create new user
        const user = await User.create(userData);

        // Generate token
        const token = generateToken(user._id);

        // Return success response
        return res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'An error occurred during registration'
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return success response
        return res.json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'An error occurred during login'
        });
    }
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}; 
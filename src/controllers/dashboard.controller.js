const User = require('../models/user.model');

// Student Dashboard
exports.getStudentDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('studentInfo');

        // Get enrolled programs (to be implemented)
        const enrolledPrograms = [];
        
        // Get applications (to be implemented)
        const applications = [];
        
        // Get saved opportunities (to be implemented)
        const savedOpportunities = [];

        res.json({
            status: 'success',
            data: {
                user,
                enrolledPrograms,
                applications,
                savedOpportunities
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Company Dashboard
exports.getCompanyDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('companyInfo');

        // Get posted jobs (to be implemented)
        const postedJobs = [];
        
        // Get applicants (to be implemented)
        const applicants = [];

        res.json({
            status: 'success',
            data: {
                user,
                postedJobs,
                applicants
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// University Dashboard
exports.getUniversityDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('universityInfo');

        // Get enrolled students (to be implemented)
        const enrolledStudents = [];
        
        // Get programs (to be implemented)
        const programs = [];
        
        // Get validation requests (to be implemented)
        const validationRequests = [];

        res.json({
            status: 'success',
            data: {
                user,
                enrolledStudents,
                programs,
                validationRequests
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}; 
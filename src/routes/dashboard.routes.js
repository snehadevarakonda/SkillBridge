const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All dashboard routes are protected
router.use(protect);

// Student dashboard
router.get('/student', 
    restrictTo('student'),
    dashboardController.getStudentDashboard
);

// Company dashboard
router.get('/company',
    restrictTo('company'),
    dashboardController.getCompanyDashboard
);

// University dashboard
router.get('/university',
    restrictTo('university'),
    dashboardController.getUniversityDashboard
);

module.exports = router; 
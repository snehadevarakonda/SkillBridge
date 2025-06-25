const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controller');

// Home page route
router.get('/', indexController.getHomePage);

// Search route
router.get('/search', indexController.searchServices);

// Popular categories route
router.get('/categories', indexController.getCategories);

// Trusted companies route
router.get('/companies', indexController.getTrustedCompanies);

// How it works route
router.get('/how-it-works', indexController.getHowItWorks);

// Features route
router.get('/features', indexController.getFeatures);

module.exports = router; 
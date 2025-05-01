const express = require('express');
const {
    getDashboardSummary,
    getMonthlyStats,
    getYearlyStats,
    getTopDrivers
} = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

router.get('/summary', getDashboardSummary);
router.get('/statistics/:month/:year', getMonthlyStats);
router.get('/statistics/:year', getYearlyStats);
router.get('/drivers', getTopDrivers);

module.exports = router;
const statsService = require('../services/statsService');
const { AppError } = require('../utils/appError');
const logger = require('../utils/logger');

/**
 * Get dashboard summary
 * @route GET /api/dashboard/summary
 * @access Private
 */
exports.getDashboardSummary = async (req, res, next) => {
    try {
        const summary = await statsService.getDashboardSummary();

        res.status(200).json({
            status: 'success',
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get monthly statistics
 * @route GET /api/dashboard/statistics/:month/:year
 * @access Private
 */
exports.getMonthlyStats = async (req, res, next) => {
    try {
        const { month, year } = req.params;

        // Validate month and year
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        if (
            isNaN(monthNum) ||
            isNaN(yearNum) ||
            monthNum < 1 ||
            monthNum > 12 ||
            yearNum < 2000 ||
            yearNum > 2100
        ) {
            throw new AppError('Invalid month or year', 400);
        }

        const stats = await statsService.getMonthlyStats(monthNum, yearNum);

        res.status(200).json({
            status: 'success',
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get yearly statistics
 * @route GET /api/dashboard/statistics/:year
 * @access Private
 */
exports.getYearlyStats = async (req, res, next) => {
    try {
        const { year } = req.params;

        // Validate year
        const yearNum = parseInt(year, 10);

        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
            throw new AppError('Invalid year', 400);
        }

        const stats = await statsService.getYearlyStats(yearNum);

        res.status(200).json({
            status: 'success',
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get top drivers
 * @route GET /api/dashboard/drivers
 * @access Private
 */
exports.getTopDrivers = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 5;

        const drivers = await statsService.getTopDrivers(limit);

        res.status(200).json({
            status: 'success',
            data: drivers,
        });
    } catch (error) {
        next(error);
    }
};
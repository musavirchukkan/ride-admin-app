const { Statistic, Order, Driver, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { AppError } = require('../utils/appError');
const logger = require('../utils/logger');

/**
 * Calculate and retrieve monthly statistics
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<Object>} Statistics for the specified month
 */
exports.getMonthlyStats = async (month, year) => {
    try {
        // Try to get existing statistics for the month
        let stats = await Statistic.findOne({
            where: {
                month,
                year,
            },
        });

        // If stats exist and are up to date (last updated today), return them
        if (
            stats &&
            new Date(stats.updatedAt).toDateString() === new Date().toDateString()
        ) {
            return stats;
        }

        // Calculate new statistics
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Get orders for the month
        const orders = await Order.findAll({
            where: {
                orderedTime: {
                    [Op.between]: [startDate, endDate],
                },
            },
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('income')), 'totalIncome'],
            ],
            group: ['status'],
        });

        // Calculate totals
        const totalOrders = orders.reduce(
            (sum, order) => sum + parseInt(order.getDataValue('count'), 10),
            0
        );
        const totalEarnings = orders.reduce(
            (sum, order) => sum + parseFloat(order.getDataValue('totalIncome') || 0),
            0
        );
        const totalProfit = totalEarnings * 0.2; // Assuming 20% profit margin

        // Calculate average grade (ratings)
        const ratingStats = await Order.findOne({
            where: {
                orderedTime: {
                    [Op.between]: [startDate, endDate],
                },
                rating: {
                    [Op.not]: null,
                },
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'ratingCount'],
            ],
        });

        const averageGrade = parseFloat(ratingStats.getDataValue('averageRating') || 0);
        const examsCount = parseInt(ratingStats.getDataValue('ratingCount') || 0, 10);

        // Create or update statistics record
        if (stats) {
            stats = await stats.update({
                averageGrade,
                examsCount,
                totalOrders,
                totalEarnings,
                totalProfit,
            });
        } else {
            stats = await Statistic.create({
                month,
                year,
                averageGrade,
                examsCount,
                totalOrders,
                totalEarnings,
                totalProfit,
            });
        }

        return stats;
    } catch (error) {
        logger.error('Error calculating monthly statistics:', error);
        throw new AppError('Failed to calculate statistics', 500);
    }
};

/**
 * Get statistics for all months in a year
 * @param {number} year - Year
 * @returns {Promise<Array>} Array of monthly statistics
 */
exports.getYearlyStats = async (year) => {
    try {
        // Get stats for all months in the year
        const yearStats = await Statistic.findAll({
            where: {
                year,
            },
            order: [['month', 'ASC']],
        });

        // Fill in missing months with zeros
        const fullYearStats = [];
        for (let month = 1; month <= 12; month++) {
            const existingStat = yearStats.find((stat) => stat.month === month);
            if (existingStat) {
                fullYearStats.push(existingStat);
            } else {
                fullYearStats.push({
                    month,
                    year,
                    averageGrade: 0,
                    examsCount: 0,
                    totalOrders: 0,
                    totalEarnings: 0,
                    totalProfit: 0,
                });
            }
        }

        return fullYearStats;
    } catch (error) {
        logger.error('Error getting yearly statistics:', error);
        throw new AppError('Failed to get yearly statistics', 500);
    }
};

/**
 * Get dashboard summary statistics
 * @returns {Promise<Object>} Dashboard summary statistics
 */
exports.getDashboardSummary = async () => {
    try {
        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Get current month statistics
        const currentMonthStats = await this.getMonthlyStats(currentMonth, currentYear);

        // Get total orders count
        const totalOrders = await Order.count();

        // Get total earnings
        const earningsResult = await Order.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('income')), 'totalEarnings'],
            ],
        });
        const totalEarnings = parseFloat(earningsResult.getDataValue('totalEarnings') || 0);

        // Get active drivers count
        const activeDrivers = await Driver.count({
            where: { isActive: true },
        });

        // Get top drivers
        const topDrivers = await Driver.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email', 'phoneNumber', 'profileImage'],
                },
            ],
            order: [['rating', 'DESC']],
            limit: 5,
        });

        // Get recent orders
        const recentOrders = await Order.findAll({
            include: [
                {
                    model: Driver,
                    as: 'driver',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['fullName'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'client',
                    attributes: ['fullName'],
                },
            ],
            order: [['orderedTime', 'DESC']],
            limit: 10,
        });

        return {
            totalOrders,
            totalEarnings,
            totalProfit: totalEarnings * 0.2, // Assuming 20% profit margin
            activeDrivers,
            currentMonthStats,
            topDrivers,
            recentOrders,
        };
    } catch (error) {
        logger.error('Error getting dashboard summary:', error);
        throw new AppError('Failed to get dashboard summary', 500);
    }
};

/**
 * Get top performing drivers
 * @param {number} limit - Number of drivers to return
 * @returns {Promise<Array>} Array of top drivers
 */
exports.getTopDrivers = async (limit = 5) => {
    try {
        const topDrivers = await Driver.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email', 'phoneNumber', 'profileImage'],
                },
            ],
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM orders WHERE orders.driver_id = "Driver".id)'), 'ordersCount'],
                    [sequelize.literal('(SELECT SUM(income) FROM orders WHERE orders.driver_id = "Driver".id)'), 'totalIncome'],
                ],
            },
            order: [
                [sequelize.literal('totalIncome'), 'DESC'],
                ['rating', 'DESC'],
            ],
            limit,
        });

        return topDrivers;
    } catch (error) {
        logger.error('Error getting top drivers:', error);
        throw new AppError('Failed to get top drivers', 500);
    }
};
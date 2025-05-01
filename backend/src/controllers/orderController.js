const { Order, Driver, User } = require('../models');
const { AppError } = require('../utils/appError');
const { ORDER_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Get all orders with pagination and filtering
 * @route GET /api/orders
 * @access Private
 */
exports.getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Filter parameters
        const { status, startDate, endDate, driverId, clientId } = req.query;

        // Build filter object
        const filter = {};

        if (status && Object.values(ORDER_STATUS).includes(status)) {
            filter.status = status;
        }

        if (driverId) {
            filter.driverId = driverId;
        }

        if (clientId) {
            filter.clientId = clientId;
        }

        // Date range filter
        if (startDate || endDate) {
            filter.orderedTime = {};

            if (startDate) {
                filter.orderedTime[Op.gte] = new Date(startDate);
            }

            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                filter.orderedTime[Op.lte] = endDateTime;
            }
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where: filter,
            include: [
                {
                    model: Driver,
                    as: 'driver',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['fullName', 'phoneNumber'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'client',
                    attributes: ['id', 'fullName', 'phoneNumber'],
                },
            ],
            limit,
            offset,
            order: [['orderedTime', 'DESC']],
        });

        res.status(200).json({
            status: 'success',
            data: {
                orders,
                pagination: {
                    total: count,
                    pages: Math.ceil(count / limit),
                    page,
                    limit,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete order
 * @route DELETE /api/orders/:id
 * @access Private (Admin)
 */
exports.deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if order exists
        const order = await Order.findByPk(id);
        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Check if order is completed
        if (order.status === ORDER_STATUS.COMPLETED) {
            throw new AppError('Completed orders cannot be deleted', 400);
        }

        // Delete order
        await order.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Order deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get order statistics
 * @route GET /api/orders/stats
 * @access Private
 */
exports.getOrderStats = async (req, res, next) => {
    try {
        // Get counts by status
        const statusCounts = await Promise.all(
            Object.values(ORDER_STATUS).map(async (status) => {
                const count = await Order.count({ where: { status } });
                return { status, count };
            })
        );

        // Get total income
        const totalIncomeResult = await Order.sum('income', {
            where: { status: ORDER_STATUS.COMPLETED },
        });

        // Get average rating
        const averageRatingResult = await Order.findOne({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
            ],
            where: {
                rating: { [Op.not]: null },
            },
        });

        const totalIncome = totalIncomeResult || 0;
        const averageRating = parseFloat(averageRatingResult.getDataValue('averageRating')) || 0;

        // Get recent orders count by date (last 7 days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            const count = await Order.count({
                where: {
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });

            last7Days.push({
                date: startOfDay.toISOString().split('T')[0],
                count,
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                statusCounts,
                totalIncome,
                averageRating,
                last7Days,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id, {
            include: [
                {
                    model: Driver,
                    as: 'driver',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['fullName', 'phoneNumber', 'email'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'client',
                    attributes: ['id', 'fullName', 'phoneNumber', 'email'],
                },
            ],
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { order },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
exports.createOrder = async (req, res, next) => {
    try {
        const {
            driverId,
            clientId,
            carComfort,
            orderedTime,
            startLocation,
            finishLocation,
            income,
            status = ORDER_STATUS.PENDING,
        } = req.body;

        // Check if driver exists and is active
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            throw new AppError('Driver not found', 404);
        }

        if (!driver.isActive) {
            throw new AppError('Driver is not active', 400);
        }

        // Check if client exists
        const client = await User.findByPk(clientId);
        if (!client) {
            throw new AppError('Client not found', 404);
        }

        // Create order
        const order = await Order.create({
            driverId,
            clientId,
            carComfort,
            orderedTime,
            startLocation,
            finishLocation,
            income,
            status,
        });

        // Get the full order with relationships
        const fullOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: Driver,
                    as: 'driver',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['fullName', 'phoneNumber'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'client',
                    attributes: ['id', 'fullName', 'phoneNumber'],
                },
            ],
        });

        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: { order: fullOrder },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update order
 * @route PUT /api/orders/:id
 * @access Private
 */
exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            carComfort,
            orderedTime,
            startLocation,
            finishLocation,
            income,
            status,
            rating,
            clientComment,
            distance,
            duration,
        } = req.body;

        // Check if order exists
        const order = await Order.findByPk(id);
        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // If changing status to completed, update driver stats
        if (status === ORDER_STATUS.COMPLETED && order.status !== ORDER_STATUS.COMPLETED) {
            const driver = await Driver.findByPk(order.driverId);
            if (driver) {
                // Update driver's total trips and earnings
                await driver.update({
                    totalTrips: driver.totalTrips + 1,
                    totalEarnings: Number(driver.totalEarnings) + Number(income || order.income),
                });

                // Update driver's rating if provided
                if (rating) {
                    const newRating = (driver.rating * driver.totalTrips + rating) / (driver.totalTrips + 1);
                    await driver.update({
                        rating: parseFloat(newRating.toFixed(2)),
                    });
                }
            }
        }

        // Update order
        await order.update({
            carComfort: carComfort || order.carComfort,
            orderedTime: orderedTime || order.orderedTime,
            startLocation: startLocation || order.startLocation,
            finishLocation: finishLocation || order.finishLocation,
            income: income || order.income,
            status: status || order.status,
            rating: rating || order.rating,
            clientComment: clientComment || order.clientComment,
            distance: distance || order.distance,
            duration: duration || order.duration,
        });

        // Get the updated order with relationships
        const updatedOrder = await Order.findByPk(id, {
            include: [
                {
                    model: Driver,
                    as: 'driver',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['fullName', 'phoneNumber'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'client',
                    attributes: ['id', 'fullName', 'phoneNumber'],
                },
            ],
        });

        res.status(200).json({
            status: 'success',
            message: 'Order updated successfully',
            data: { order: updatedOrder },
        });
    } catch (error) {
        next(error);
    }
};
const { Driver, User, Order } = require('../models');
const { AppError } = require('../utils/appError');
const { ROLES } = require('../utils/constants');
const { hashPassword } = require('../utils/passwordUtils');
const logger = require('../utils/logger');

/**
 * Get all drivers with pagination
 * @route GET /api/drivers
 * @access Private
 */
exports.getAllDrivers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: drivers } = await Driver.findAndCountAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email', 'phoneNumber', 'profileImage', 'status'],
                },
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            status: 'success',
            data: {
                drivers,
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
 * Get driver by ID
 * @route GET /api/drivers/:id
 * @access Private
 */
exports.getDriverById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const driver = await Driver.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email', 'phoneNumber', 'profileImage', 'status'],
                },
            ],
        });

        if (!driver) {
            throw new AppError('Driver not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { driver },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new driver
 * @route POST /api/drivers
 * @access Private (Admin)
 */
exports.createDriver = async (req, res, next) => {
    try {
        const {
            fullName,
            email,
            password,
            phoneNumber,
            profileImage,
            licenseNumber,
            licenseExpiryDate,
        } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError('Email already in use', 409);
        }

        // Create user with driver role
        const user = await User.create({
            fullName,
            email,
            password,
            phoneNumber,
            profileImage,
            role: ROLES.DRIVER,
            isEmailVerified: true, // Admin-created drivers are pre-verified
            status: 'active',
        });

        // Create driver
        const driver = await Driver.create({
            userId: user.id,
            licenseNumber,
            licenseExpiryDate,
            isActive: true,
        });

        // Get the full driver with user details
        const fullDriver = await Driver.findByPk(driver.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email', 'phoneNumber', 'profileImage', 'status'],
                },
            ],
        });

        res.status(201).json({
            status: 'success',
            message: 'Driver created successfully',
            data: { driver: fullDriver },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update driver
 * @route PUT /api/drivers/:id
 * @access Private (Admin)
 */
exports.updateDriver = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            fullName,
            email,
            phoneNumber,
            profileImage,
            licenseNumber,
            licenseExpiryDate,
            isActive,
        } = req.body;

        // Check if driver exists
        const driver = await Driver.findByPk(id);
        if (!driver) {
            throw new AppError('Driver not found', 404);
        }

        // Get associated user
        const user = await User.findByPk(driver.userId);
        if (!user) {
            throw new AppError('Associated user not found', 404);
        }

        // Check if email is being changed and if it's already in use
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new AppError('Email already in use', 409);
            }
        }

        // Update user
        await user.update({
            fullName: fullName || user.fullName,
            email: email || user.email,
            phoneNumber: phoneNumber || user.phoneNumber,
            profileImage: profileImage || user.profileImage,
        });

        // Update driver
        await driver.update({
            licenseNumber: licenseNumber || driver.licenseNumber,
            licenseExpiryDate: licenseExpiryDate || driver.licenseExpiryDate,
            isActive: isActive !== undefined ? isActive : driver.isActive,
        });

        // Get the updated driver with user details
        const updatedDriver = await Driver.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email', 'phoneNumber', 'profileImage', 'status'],
                },
            ],
        });

        res.status(200).json({
            status: 'success',
            message: 'Driver updated successfully',
            data: { driver: updatedDriver },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete driver
 * @route DELETE /api/drivers/:id
 * @access Private (Admin)
 */
exports.deleteDriver = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if driver exists
        const driver = await Driver.findByPk(id);
        if (!driver) {
            throw new AppError('Driver not found', 404);
        }

        // Check if driver has completed orders
        const completedOrders = await Order.count({
            where: {
                driverId: id,
                status: 'completed',
            },
        });

        if (completedOrders > 0) {
            // If driver has completed orders, just deactivate
            await driver.update({ isActive: false });

            const user = await User.findByPk(driver.userId);
            if (user) {
                await user.update({ status: 'inactive' });
            }

            res.status(200).json({
                status: 'success',
                message: 'Driver has completed orders. Driver has been deactivated instead of deleted.',
            });
        } else {
            // If no completed orders, can safely delete
            const userId = driver.userId;

            // Delete driver
            await driver.destroy();

            // Delete associated user
            await User.destroy({ where: { id: userId } });

            res.status(200).json({
                status: 'success',
                message: 'Driver deleted successfully',
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Get driver orders
 * @route GET /api/drivers/:id/orders
 * @access Private
 */
exports.getDriverOrders = async (req, res, next) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Check if driver exists
        const driver = await Driver.findByPk(id);
        if (!driver) {
            throw new AppError('Driver not found', 404);
        }

        // Get driver orders
        const { count, rows: orders } = await Order.findAndCountAll({
            where: { driverId: id },
            include: [
                {
                    model: User,
                    as: 'client',
                    attributes: ['id', 'fullName', 'email'],
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
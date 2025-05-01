const { User, OtpVerification } = require('../models');
const { Op } = require('sequelize');
const { AppError } = require('../utils/appError');
const { generateOTP, comparePassword } = require('../utils/passwordUtils');
const { AUTH, ROLES } = require('../utils/constants');
const { generateTokenResponse } = require('../utils/jwt');
const { sendOtpEmail } = require('./emailService');
const { checkIfIpIsRestricted } = require('./geoLocationService');
const logger = require('../utils/logger');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} ip - User's IP address
 * @returns {Promise<Object>} Newly created user
 */
exports.register = async (userData, ip) => {
    try {
        // Check if IP is from a restricted country
        const { countryCode, country } = await checkIfIpIsRestricted(ip);

        // Check if user already exists
        const existingUser = await User.findOne({
            where: { email: userData.email.toLowerCase() },
        });

        if (existingUser) {
            throw new AppError('Email already in use', 409);
        }

        // Create new user with inactive status
        const user = await User.create({
            ...userData,
            email: userData.email.toLowerCase(),
            countryCode,
            country,
            status: 'inactive',
            role: ROLES.USER, // Default role
        });

        // Generate and send OTP for email verification
        await this.generateAndSendOTP(
            user.email,
            AUTH.OTP_PURPOSE.REGISTRATION
        );

        return user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        logger.error('Registration error:', error);
        throw new AppError('User registration failed', 500);
    }
};

/**
 * Verify OTP for registration or password reset
 * @param {string} email - User email
 * @param {string} otpCode - OTP code to verify
 * @param {string} purpose - Purpose of OTP (registration or password_reset)
 * @returns {Promise<boolean>} True if OTP is verified successfully
 */
exports.verifyOTP = async (email, otpCode, purpose) => {
    try {
        // Find the most recent unused OTP for the provided email and purpose
        const otpVerification = await OtpVerification.findOne({
            where: {
                email: email.toLowerCase(),
                otpCode,
                purpose,
                isUsed: false,
                expiresAt: { [Op.gt]: new Date() },
            },
            order: [['createdAt', 'DESC']],
        });

        if (!otpVerification) {
            throw new AppError('Invalid or expired OTP', 400);
        }

        // Mark OTP as used
        await otpVerification.update({ isUsed: true });

        // If registration verification, activate the user
        if (purpose === AUTH.OTP_PURPOSE.REGISTRATION) {
            const user = await User.findOne({
                where: { email: email.toLowerCase() },
            });

            if (user) {
                await user.update({
                    isEmailVerified: true,
                    status: 'active',
                });
            }
        }

        return true;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        logger.error('OTP verification error:', error);
        throw new AppError('OTP verification failed', 500);
    }
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User and tokens
 */
exports.login = async (email, password) => {
    try {
        // Find user by email
        const user = await User.findOne({
            where: {
                email: email.toLowerCase(),
                status: 'active',
            },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check if password matches
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Update last login timestamp
        await user.update({ lastLogin: new Date() });

        // Generate tokens
        const tokens = generateTokenResponse(user);

        return {
            user,
            tokens,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        logger.error('Login error:', error);
        throw new AppError('Login failed', 500);
    }
};

/**
 * Generate and send OTP to user's email
 * @param {string} email - User email
 * @param {string} purpose - Purpose of OTP (registration or password_reset)
 * @returns {Promise<void>}
 */
exports.generateAndSendOTP = async (email, purpose) => {
    try {
        // Generate new OTP
        const otpCode = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + AUTH.OTP_EXPIRATION_MINUTES);

        // Create OTP record in database
        await OtpVerification.create({
            email: email.toLowerCase(),
            otpCode,
            purpose,
            expiresAt,
        });

        // Send OTP by email
        await sendOtpEmail(email, otpCode, purpose);
    } catch (error) {
        logger.error('Error generating and sending OTP:', error);
        throw new AppError('Failed to send verification code', 500);
    }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<boolean>} True if password reset request successful
 */
exports.forgotPassword = async (email) => {
    try {
        // Check if user exists
        const user = await User.findOne({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            // For security reasons, don't reveal that the email doesn't exist
            return true;
        }

        // Generate and send OTP for password reset
        await this.generateAndSendOTP(
            email,
            AUTH.OTP_PURPOSE.PASSWORD_RESET
        );

        return true;
    } catch (error) {
        logger.error('Forgot password error:', error);
        throw new AppError('Password reset request failed', 500);
    }
};

/**
 * Reset password using OTP
 * @param {string} email - User email
 * @param {string} otpCode - OTP code
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} True if password reset successful
 */
exports.resetPassword = async (email, otpCode, newPassword) => {
    try {
        // Verify OTP
        const isOtpValid = await this.verifyOTP(
            email,
            otpCode,
            AUTH.OTP_PURPOSE.PASSWORD_RESET
        );

        if (!isOtpValid) {
            throw new AppError('Invalid or expired OTP', 400);
        }

        // Update user's password
        const user = await User.findOne({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        await user.update({ password: newPassword });

        return true;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        logger.error('Password reset error:', error);
        throw new AppError('Password reset failed', 500);
    }
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
exports.refreshToken = async (refreshToken) => {
    try {
        // Verify refresh token and extract user ID
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Get user by ID
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new AppError('Invalid refresh token', 401);
        }

        // Generate new tokens
        const tokens = generateTokenResponse(user);

        return tokens;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Refresh token expired', 401);
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid refresh token', 401);
        }

        logger.error('Token refresh error:', error);
        throw new AppError('Token refresh failed', 500);
    }
};
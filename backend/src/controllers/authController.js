const authService = require('../services/authService');
const { getIpFromRequest } = require('../services/geoLocationService');
const { AppError } = require('../utils/appError');
const logger = require('../utils/logger');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
    try {
        const { email, password, fullName, phoneNumber } = req.body;
        const ip = getIpFromRequest(req);

        const user = await authService.register(
            { email, password, fullName, phoneNumber },
            ip
        );

        res.status(201).json({
            status: 'success',
            message: 'Registration successful. Please check your email for verification code.',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify OTP code
 * @route POST /api/auth/verify-otp
 * @access Public
 */
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otpCode, purpose } = req.body;

        await authService.verifyOTP(email, otpCode, purpose);

        res.status(200).json({
            status: 'success',
            message: purpose === 'registration'
                ? 'Email verified successfully. You can now log in.'
                : 'Verification successful.',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Log in user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, tokens } = await authService.login(email, password);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                },
                tokens,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        await authService.forgotPassword(email);

        res.status(200).json({
            status: 'success',
            message: 'If your email is registered, you will receive a password reset code.',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password with OTP
 * @route POST /api/auth/reset-password
 * @access Public
 */
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otpCode, newPassword } = req.body;

        await authService.resetPassword(email, otpCode, newPassword);

        res.status(200).json({
            status: 'success',
            message: 'Password reset successful. You can now log in with your new password.',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh token
 * @route POST /api/auth/refresh-token
 * @access Public
 */
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required', 400);
        }

        const tokens = await authService.refreshToken(refreshToken);

        res.status(200).json({
            status: 'success',
            data: { tokens },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res, next) => {
    try {
        // User is already attached to req by auth middleware
        const user = req.user;

        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Resend OTP
 * @route POST /api/auth/resend-otp
 * @access Public
 */
exports.resendOtp = async (req, res, next) => {
    try {
        const { email, purpose } = req.body;

        await authService.generateAndSendOTP(email, purpose);

        res.status(200).json({
            status: 'success',
            message: 'Verification code sent to your email.',
        });
    } catch (error) {
        next(error);
    }
};
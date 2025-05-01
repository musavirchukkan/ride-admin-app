const { body, param, query } = require('express-validator');
const { isStrongPassword } = require('./passwordUtils');
const { ROLES, ORDER_STATUS, CAR_COMFORT } = require('./constants');

/**
 * Validation rules for registration
 */
exports.registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .custom((value) => {
            if (!isStrongPassword(value)) {
                throw new Error(
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                );
            }
            return true;
        }),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('phoneNumber')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
];

/**
 * Validation rules for login
 */
exports.loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
];

/**
 * Validation rules for verifying OTP
 */
exports.verifyOtpValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('otpCode')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits')
        .isNumeric()
        .withMessage('OTP must contain only numbers'),
];

/**
 * Validation rules for password reset request
 */
exports.forgotPasswordValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
];

/**
 * Validation rules for password reset
 */
exports.resetPasswordValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('otpCode')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits')
        .isNumeric()
        .withMessage('OTP must contain only numbers'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .custom((value) => {
            if (!isStrongPassword(value)) {
                throw new Error(
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                );
            }
            return true;
        }),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];

/**
 * Validation rules for creating/updating a driver
 */
exports.driverValidation = [
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('phoneNumber')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('profileImage')
        .optional()
        .isURL()
        .withMessage('Profile image must be a valid URL'),
];

/**
 * Validation rules for creating/updating an order
 */
exports.orderValidation = [
    body('driverId')
        .isUUID()
        .withMessage('Driver ID must be a valid UUID'),
    body('clientId')
        .isUUID()
        .withMessage('Client ID must be a valid UUID'),
    body('carComfort')
        .isIn(Object.values(CAR_COMFORT))
        .withMessage('Invalid car comfort level'),
    body('orderedTime')
        .isISO8601()
        .withMessage('Ordered time must be a valid ISO 8601 date'),
    body('startLocation')
        .isLength({ min: 2, max: 255 })
        .withMessage('Start location must be between 2 and 255 characters'),
    body('finishLocation')
        .isLength({ min: 2, max: 255 })
        .withMessage('Finish location must be between 2 and 255 characters'),
    body('income')
        .isNumeric()
        .withMessage('Income must be a number'),
    body('status')
        .optional()
        .isIn(Object.values(ORDER_STATUS))
        .withMessage('Invalid order status'),
];

/**
 * Validation rules for pagination
 */
exports.paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];
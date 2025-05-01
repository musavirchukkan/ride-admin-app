const express = require('express');
const {
    register,
    verifyOtp,
    login,
    forgotPassword,
    resetPassword,
    refreshToken,
    getMe,
    resendOtp
} = require('../controllers/authController');

const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
    registerValidation,
    loginValidation,
    verifyOtpValidation,
    forgotPasswordValidation,
    resetPasswordValidation
} = require('../utils/validators');
const { authRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.post('/register', authRateLimiter, validate(registerValidation), register);
router.post('/verify-otp', validate(verifyOtpValidation), verifyOtp);
router.post('/login', authRateLimiter, validate(loginValidation), login);
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordValidation), forgotPassword);
router.post('/reset-password', authRateLimiter, validate(resetPasswordValidation), resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/resend-otp', resendOtp);

// Protected routes
router.get('/me', authenticate, getMe);

module.exports = router;
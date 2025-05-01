const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware to prevent abuse
 */
exports.rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes by default
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.'
    },
    // Skip rate limiting in test environment
    skip: () => process.env.NODE_ENV === 'test'
});

/**
 * Stricter rate limiter for sensitive routes like authentication
 */
exports.authRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many login attempts, please try again later.'
    },
    skip: () => process.env.NODE_ENV === 'test'
});
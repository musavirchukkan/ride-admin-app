const passport = require('passport');
const { AppError } = require('../utils/appError');

/**
 * Middleware for checking if the user is authenticated
 */
exports.authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(new AppError('Authentication error', 500));
        }

        if (!user) {
            return next(new AppError('Unauthorized - Invalid or expired token', 401));
        }

        // Attach the user to the request object
        req.user = user;
        next();
    })(req, res, next);
};

/**
 * Middleware for checking user roles
 * @param {Array} roles - Array of allowed roles
 */
exports.authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Unauthorized access', 401));
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return next(new AppError('Forbidden - Insufficient permissions', 403));
        }

        next();
    };
};
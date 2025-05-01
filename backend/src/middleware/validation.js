const { validationResult } = require('express-validator');
const { AppError } = require('../utils/appError');

/**
 * Middleware to validate request data based on express-validator rules
 */
exports.validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check if there are validation errors
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Format validation errors
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        // Respond with 400 Bad Request and validation errors
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: formattedErrors
        });
    };
};

/**
 * Middleware to check if ID parameter is valid UUID
 */
exports.validateUuid = (req, res, next) => {
    const idParam = req.params.id;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!idParam || !uuidRegex.test(idParam)) {
        return next(new AppError('Invalid ID format', 400));
    }

    next();
};
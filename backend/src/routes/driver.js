const express = require('express');
const {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    getDriverOrders
} = require('../controllers/driverController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, validateUuid } = require('../middleware/validation');
const { driverValidation, paginationValidation } = require('../utils/validators');
const { ROLES } = require('../utils/constants');

const router = express.Router();

// All driver routes require authentication
router.use(authenticate);

// Routes accessible to all authenticated users
router.get('/', validate(paginationValidation), getAllDrivers);
router.get('/:id', validateUuid, getDriverById);
router.get('/:id/orders', validateUuid, validate(paginationValidation), getDriverOrders);

// Routes accessible only to admins
router.post('/', authorize(ROLES.ADMIN), validate(driverValidation), createDriver);
router.put('/:id', authorize(ROLES.ADMIN), validateUuid, validate(driverValidation), updateDriver);
router.delete('/:id', authorize(ROLES.ADMIN), validateUuid, deleteDriver);

module.exports = router;
const express = require('express');
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderStats
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, validateUuid } = require('../middleware/validation');
const { orderValidation, paginationValidation } = require('../utils/validators');
const { ROLES } = require('../utils/constants');

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Routes accessible to all authenticated users
router.get('/', validate(paginationValidation), getAllOrders);
router.get('/stats', getOrderStats);
router.get('/:id', validateUuid, getOrderById);

// Routes accessible to admins and drivers
router.post('/', authorize([ROLES.ADMIN, ROLES.DRIVER]), validate(orderValidation), createOrder);
router.put('/:id', authorize([ROLES.ADMIN, ROLES.DRIVER]), validateUuid, validate(orderValidation), updateOrder);

// Routes accessible only to admins
router.delete('/:id', authorize(ROLES.ADMIN), validateUuid, deleteOrder);

module.exports = router;
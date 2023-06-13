const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const orderController = require('../controller/order');

router.post('/order', authMiddleware, orderController.checkout);
router.get('/order/:orderId', authMiddleware, orderController.getOrder);

module.exports = router;

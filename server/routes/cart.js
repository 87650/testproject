const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const cartController = require('../controller/cart');

router.post('/cart/:productId', authMiddleware, cartController.addToCart);
router.get('/cart', authMiddleware, cartController.getCart);
router.put('/cart/:cartItemId', authMiddleware, cartController.updateCartItem);
router.delete('/cart/:cartItemId', authMiddleware, cartController.deleteCartItem);

module.exports = router;

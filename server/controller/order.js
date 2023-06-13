const Order = require('../model/order');
const ApiError = require('../utils/errors');

const orderController = {};

orderController.checkout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({ user: userId })
      .populate('product')
      .exec();

    if (!cartItems.length) {
      return next(new ApiError('Cart is empty', 400));
    }

    const order = new Order({
      user: userId,
      products: cartItems.map((cartItem) => cartItem.product),
    });

    await order.save();

    await Cart.deleteMany({ user: userId }).exec();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

orderController.getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('products')
      .exec();

    if (!order) {
      return next(new ApiError('Order not found', 404));
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = orderController;

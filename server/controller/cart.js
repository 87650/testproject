const Cart = require('../model/cart');
const Product = require('../model/product');
const Order = require('../model/order');

const cartController = {};

cartController.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const existingCartItem = await Cart.findOne({ user: userId, product: productId });
    if (existingCartItem) {
      return res.json(await cartController.getCartItems(userId));
    }

    const cartItem = new Cart({
      user: userId,
      product: productId,
    });
    await cartItem.save();

    const cartItems = await cartController.getCartItems(userId);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

cartController.getCartItems = async (userId) => {
  const cartItems = await Cart.find({ user: userId }).populate('product').exec();
  return cartItems.map((cartItem) => ({
    _id: cartItem._id,
    name: cartItem.product.name,
    price: cartItem.product.price,
  }));
};

cartController.getCart = async (req, res, next) => {
  try {
    const cartItems = await cartController.getCartItems(req.user.id);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

cartController.updateCartItem = async (req, res, next) => {
  try {
    const cartItemId = req.params.cartItemId;
    const { action } = req.query;

    let cartItem = await Cart.findById(cartItemId).populate('product').exec();
    if (!cartItem) {
      return next(new ApiError('Cart item not found', 404));
    }

    switch (action) {
      case 'increment':
        cartItem = await Cart.findByIdAndUpdate(
          cartItemId,
          { $inc: { quantity: 1 } },
          { new: true },
        ).populate('product').exec();
        break;
      case 'decrement':
        if (cartItem.quantity === 1) {
          await Cart.findByIdAndDelete(cartItemId).exec();
        } else {
          cartItem = await Cart.findByIdAndUpdate(
            cartItemId,
            { $inc: { quantity: -1 } },
            { new: true },
          ).populate('product').exec();
        }
        break;
      default:
        break;
    }

    const cartItems = await cartController.getCartItems(req.user.id);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

cartController.deleteCartItem = async (req, res, next) => {
  try {
    const cartItemId = req.params.cartItemId;
    await Cart.findByIdAndDelete(cartItemId).exec();
    const cartItems = await cartController.getCartItems(req.user.id);
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

cartController.checkout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({ user: userId })
      .populate('product')
      .exec();

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

module.exports = cartController;

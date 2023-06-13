const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const User = require('../model/user');
const ApiError = require('../utils/errors');

const authController = {};

authController.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError('Invalid email or password', 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError('Invalid email or password', 400));
  }

  const token = jwt.sign({ id: user.id }, config.get('jwtSecret'));
  res.json({ token });
};

authController.register = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError('User already exists', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
  });

  await user.save();

  const token = jwt.sign({ id: user.id }, config.get('jwtSecret'));
  res.json({ token });
};

module.exports = authController;

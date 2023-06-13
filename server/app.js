const express = require('express');
const cors = require('cors');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

const { connect } = require('./utils/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/error');
const ApiError = require('./utils/errors');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

// Logging middleware
app.use(morgan('combined', { stream: logger.stream }));
// CORS middleware
app.use(cors());
// Security middleware
app.use(helmet());
// JSON middleware
app.use(express.json());
// URL-encoded middleware
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);

// Catch 404 errors and forward to error handler
app.use((req, res, next) => {
  next(new ApiError('Not found', 404));
});

// Custom error handler middleware
app.use(errorHandler);

// Start server
const port = config.get('port') || 5000;
connect().then(() => {
  app.listen(port, () => logger.info(`Server started on port ${port}`));
});

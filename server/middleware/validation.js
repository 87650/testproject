const Ajv = require('ajv');
const ApiError = require('../utils/errors');

const ajv = new Ajv({ allErrors: true });

const validateBody = (schema) => (req, res, next) => {
  const validate = ajv.compile(schema);
  const valid = validate(req.body);
  if (!valid) {
    return next(new ApiError('Validation error', 400, validate.errors));
  }
  next();
};

module.exports = { validateBody };

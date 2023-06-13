const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });

const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
  },
  required: ['email', 'password'],
};

const registerSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
    confirmPassword: { type: 'string', const: { $data: '1/password' } },
  },
  required: ['email', 'password', 'confirmPassword'],
};

module.exports = {
  loginSchema,
  registerSchema,
};

const { validationResult } = require('express-validator');
const { error } = require('./responseHelper');

const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const formatted = errors.array().map(e => ({ field: e.path, message: e.msg }));
    return error(res, 'Validation failed', formatted, 400);
  };
};

module.exports = { validate };
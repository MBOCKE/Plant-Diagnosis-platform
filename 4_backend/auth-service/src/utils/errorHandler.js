const { error } = require('./responseHelper');

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
    return error(res, 'Validation failed', errors, 400);
  }
  if (err.code === 11000) return error(res, 'Duplicate entry', null, 409);
  if (err.name === 'JsonWebTokenError') return error(res, 'Invalid token', null, 401);
  if (err.name === 'TokenExpiredError') return error(res, 'Token expired', null, 401);

  return error(res, err.message || 'Server error', null, err.statusCode || 500);
};

module.exports = { errorHandler };
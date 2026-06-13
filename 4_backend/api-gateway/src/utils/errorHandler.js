function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ status: 'error', message: err.message || 'Server Error' });
}

module.exports = errorHandler;

function authMiddleware(req, res, next) {
  // Simple auth check for treatment-service
  next();
}

module.exports = authMiddleware;

function authMiddleware(req, res, next) {
  // Simple auth check for case-service
  next();
}

module.exports = authMiddleware;

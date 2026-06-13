function authMiddleware(req, res, next) {
  // Simple auth check for inference-service
  next();
}

module.exports = authMiddleware;

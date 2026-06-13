const jwt = require('jsonwebtoken');
const { error } = require('./responseHelper');

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return error(res, 'No token provided', null, 401);
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    return error(res, 'Invalid token', null, 401);
  }
};

module.exports = { authMiddleware };
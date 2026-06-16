const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  async register({ email, password, name, phone, preferredLanguage, location }) {
    const exists = await User.findOne({ email });
    if (exists) {
      const err = new Error('User with this email already exists');
      err.statusCode = 409;
      throw err;
    }
    const user = await User.create({
      email,
      password,
      name,
      phone,
      preferredLanguage,
      location: location || undefined,
    });
    const token = this.generateToken(user);
    return { user, token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }
    const token = this.generateToken(user);
    return { user, token };
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return { user };
  }
}

module.exports = new AuthService();
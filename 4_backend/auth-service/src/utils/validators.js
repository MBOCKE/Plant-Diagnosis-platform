const { body } = require('express-validator');

const registerValidator = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').optional().trim(),
  body('preferredLanguage').optional().isIn(['en', 'fr']),
  body('location').optional(),
  body('location.coordinates').optional().isArray({ min: 2, max: 2 }),
  body('location.country').optional().isString(),
  body('location.region').optional().isString(),
  body('location.town').optional().isString(),
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidator, loginValidator };
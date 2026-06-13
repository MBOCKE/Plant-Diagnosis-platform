const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { success } = require('../utils/responseHelper');
const { validate } = require('../utils/validate');
const { registerValidator, loginValidator } = require('../utils/validators');
const { authMiddleware } = require('../utils/authMiddleware');
const authService = require('../services/authService');

const router = express.Router();

router.post(
  '/register',
  validate(registerValidator),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return success(res, 'Registration successful', result, 201);
  })
);

router.post(
  '/login',
  validate(loginValidator),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    return success(res, 'Login successful', result);
  })
);

router.get(
  '/profile',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const result = await authService.getProfile(req.user.id);
    return success(res, 'Profile retrieved', result);
  })
);

module.exports = router;
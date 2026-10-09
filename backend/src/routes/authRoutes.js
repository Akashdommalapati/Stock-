const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again after 15 minutes.' },
});

router.post('/login', loginLimiter, login);
router.get('/me', authMiddleware, getMe);

module.exports = router;

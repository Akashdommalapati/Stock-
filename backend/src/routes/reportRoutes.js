const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardStats, getReports } = require('../controllers/reportController');

router.get('/dashboard', authMiddleware, getDashboardStats);
router.get('/analytics', authMiddleware, getReports);

module.exports = router;

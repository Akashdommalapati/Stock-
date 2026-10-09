const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  receiveStock,
  adjustStock,
  getMovements,
  getLowStockAlerts,
} = require('../controllers/stockController');

router.post('/receive', authMiddleware, receiveStock);
router.post('/adjust', authMiddleware, adjustStock);
router.get('/movements', authMiddleware, getMovements);
router.get('/low-alerts', authMiddleware, getLowStockAlerts);

module.exports = router;

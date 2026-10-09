const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProducts,
  createProduct,
  updateProduct,
  getSettings,
  addFlavor,
  addBottleSize,
} = require('../controllers/productController');

router.get('/', authMiddleware, getProducts);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);

router.get('/settings', authMiddleware, getSettings);
router.post('/flavors', authMiddleware, addFlavor);
router.post('/bottle-sizes', authMiddleware, addBottleSize);

module.exports = router;

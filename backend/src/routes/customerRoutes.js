const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  getCustomerDetail,
} = require('../controllers/customerController');

router.get('/', authMiddleware, getCustomers);
router.post('/', authMiddleware, createCustomer);
router.put('/:id', authMiddleware, updateCustomer);
router.get('/:id', authMiddleware, getCustomerDetail);

module.exports = router;

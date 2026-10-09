const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

// Receive Stock
exports.receiveStock = async (req, res, next) => {
  try {
    const { productId, cases, date, reference, note } = req.body;

    if (!productId || !cases || cases <= 0) {
      return res.status(400).json({ message: 'Valid product and positive cases count are required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product variant not found.' });
    }

    const receivedCases = Number(cases);
    product.currentStock += receivedCases;
    await product.save();

    const movement = new StockMovement({
      product: productId,
      type: 'RECEIVED',
      cases: receivedCases,
      date: date ? new Date(date) : new Date(),
      reference: reference || 'Stock Intake',
      reason: note || 'Shipment received from supplier',
    });

    await movement.save();

    res.status(201).json({
      message: 'Stock received successfully',
      product,
      movement,
    });
  } catch (error) {
    next(error);
  }
};

// Adjust Stock (+ or -)
exports.adjustStock = async (req, res, next) => {
  try {
    const { productId, cases, isAddition, reason, note } = req.body;

    if (!productId || cases === undefined || cases === null || Number(cases) <= 0) {
      return res.status(400).json({ message: 'Valid product and positive cases quantity are required.' });
    }

    if (!reason) {
      return res.status(400).json({ message: 'Adjustment reason is required (e.g. damaged, correction, other).' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product variant not found.' });
    }

    const adjustmentAmount = isAddition ? Number(cases) : -Number(cases);

    if (product.currentStock + adjustmentAmount < 0) {
      return res.status(400).json({
        message: `Cannot deduct ${cases} cases. Current stock is only ${product.currentStock} cases.`,
      });
    }

    product.currentStock += adjustmentAmount;
    await product.save();

    const movement = new StockMovement({
      product: productId,
      type: 'ADJUSTMENT',
      cases: adjustmentAmount,
      date: new Date(),
      reference: `ADJ-${reason.toUpperCase()}`,
      reason: note ? `${reason}: ${note}` : reason,
    });

    await movement.save();

    res.json({
      message: 'Stock adjusted successfully',
      product,
      movement,
    });
  } catch (error) {
    next(error);
  }
};

// Get Stock Movements with filters
exports.getMovements = async (req, res, next) => {
  try {
    const { productId, type, startDate, endDate, limit } = req.query;

    const query = {};
    if (productId) query.product = productId;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const maxLimit = Number(limit) || 100;

    const movements = await StockMovement.find(query)
      .populate('product', 'flavor bottleSize currentStock minStockCases')
      .sort({ date: -1, createdAt: -1 })
      .limit(maxLimit);

    res.json(movements);
  } catch (error) {
    next(error);
  }
};

// Get Low Stock Alerts
exports.getLowStockAlerts = async (req, res, next) => {
  try {
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$currentStock', '$minStockCases'] },
    }).sort({ currentStock: 1 });

    res.json(lowStockProducts);
  } catch (error) {
    next(error);
  }
};

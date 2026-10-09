const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const StockMovement = require('../models/StockMovement');

// Helper to generate unique Order Number
const generateOrderNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const countToday = await Order.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  });
  const seq = String(countToday + 1).padStart(3, '0');
  return `ORD-${dateStr}-${seq}`;
};

// Create New Sale Order
exports.createOrder = async (req, res, next) => {
  try {
    const { orderDate, customerId, items } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: 'Customer is required for sale order.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Selected customer not found.' });
    }

    const processedItems = [];
    let totalCases = 0;
    let totalBill = 0;
    let totalCost = 0;
    let totalProfit = 0;

    // STEP 1: Validate stock for ALL items first
    for (const item of items) {
      if (!item.productId || !item.cases || item.cases <= 0) {
        return res.status(400).json({ message: 'Each item must have a valid product and positive cases.' });
      }

      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product variant not found or inactive.` });
      }

      // STRICT STOCK CHECK & BLOCKING
      if (item.cases > product.currentStock) {
        return res.status(400).json({
          message: `Stock insufficient for ${product.flavor} (${product.bottleSize}). Available: ${product.currentStock} cases, Requested: ${item.cases} cases.`,
          availableStock: product.currentStock,
          requestedCases: item.cases,
          product: `${product.flavor} (${product.bottleSize})`,
        });
      }

      const itemCases = Number(item.cases);
      const sellingPrice = product.sellingPricePerCase;
      const purchasePrice = product.purchasePricePerCase;
      const profitPerCase = sellingPrice - purchasePrice;
      const itemTotalPrice = itemCases * sellingPrice;
      const itemTotalCost = itemCases * purchasePrice;
      const itemTotalProfit = itemCases * profitPerCase;

      processedItems.push({
        product: product._id,
        flavor: product.flavor,
        bottleSize: product.bottleSize,
        cases: itemCases,
        sellingPrice,
        purchasePrice,
        profit: itemTotalProfit,
        totalPrice: itemTotalPrice,
      });

      totalCases += itemCases;
      totalBill += itemTotalPrice;
      totalCost += itemTotalCost;
      totalProfit += itemTotalProfit;
    }

    // STEP 2: Save Order and update stock atomically
    const orderNumber = await generateOrderNumber();
    const finalOrderDate = orderDate ? new Date(orderDate) : new Date();

    const order = new Order({
      orderNumber,
      orderDate: finalOrderDate,
      customer: customer._id,
      customerName: customer.name,
      town: customer.town,
      items: processedItems,
      totalCases,
      totalBill,
      totalCost,
      totalProfit,
    });

    await order.save();

    // Deduct stock and record stock movements
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { currentStock: -item.cases },
      });

      const movement = new StockMovement({
        product: item.product,
        type: 'SOLD',
        cases: -item.cases,
        date: finalOrderDate,
        reference: orderNumber,
        reason: `Sold to ${customer.name} (${customer.town})`,
      });
      await movement.save();
    }

    res.status(201).json({
      message: 'Sale order saved successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get Orders with search and filters
exports.getOrders = async (req, res, next) => {
  try {
    const { search, customerId, startDate, endDate, page, limit } = req.query;

    const query = {};

    if (customerId) query.customer = customerId;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { customerName: searchRegex },
        { town: searchRegex },
      ];
    }

    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) query.orderDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.orderDate.$lte = end;
      }
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name town phone')
      .sort({ orderDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      orders,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// Get single Order details
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

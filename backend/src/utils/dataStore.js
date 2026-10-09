const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const StockMovement = require('../models/StockMovement');
const Settings = require('../models/Settings');
const mongoose = require('mongoose');

// In-Memory Data Store Fallback if Mongo DB is not connected
const memoryStore = {
  settings: {
    flavors: [
      'Dew',
      'Mauser',
      'Mango',
      'Pineapple',
      'Guava',
      'Jeera',
      'Grape',
      'Orange',
      'Lemon Green',
      'Cloudy Lemon',
      'Cola',
      'Salt Soda',
    ],
    bottleSizes: ['180 ml', '200 ml', '600 ml', '1000 ml'],
  },
  products: [],
  customers: [],
  orders: [],
  stockMovements: [],
};

const isDbConnected = () => mongoose.connection.readyState === 1;

// Seed initial memory data
const initializeMemoryData = () => {
  if (memoryStore.products.length > 0) return;

  const initialProducts = [
    { _id: 'p1', flavor: 'Dew', bottleSize: '200 ml', purchasePricePerCase: 360, sellingPricePerCase: 390, profitPerCase: 30, currentStock: 120, minStockCases: 20, openingStock: 120, isActive: true },
    { _id: 'p2', flavor: 'Dew', bottleSize: '600 ml', purchasePricePerCase: 480, sellingPricePerCase: 520, profitPerCase: 40, currentStock: 80, minStockCases: 15, openingStock: 80, isActive: true },
    { _id: 'p3', flavor: 'Mauser', bottleSize: '200 ml', purchasePricePerCase: 350, sellingPricePerCase: 380, profitPerCase: 30, currentStock: 100, minStockCases: 20, openingStock: 100, isActive: true },
    { _id: 'p4', flavor: 'Mango', bottleSize: '200 ml', purchasePricePerCase: 370, sellingPricePerCase: 410, profitPerCase: 40, currentStock: 150, minStockCases: 25, openingStock: 150, isActive: true },
    { _id: 'p5', flavor: 'Mango', bottleSize: '600 ml', purchasePricePerCase: 500, sellingPricePerCase: 550, profitPerCase: 50, currentStock: 60, minStockCases: 15, openingStock: 60, isActive: true },
    { _id: 'p6', flavor: 'Pineapple', bottleSize: '200 ml', purchasePricePerCase: 360, sellingPricePerCase: 395, profitPerCase: 35, currentStock: 90, minStockCases: 20, openingStock: 90, isActive: true },
    { _id: 'p7', flavor: 'Guava', bottleSize: '200 ml', purchasePricePerCase: 375, sellingPricePerCase: 415, profitPerCase: 40, currentStock: 75, minStockCases: 15, openingStock: 75, isActive: true },
    { _id: 'p8', flavor: 'Jeera', bottleSize: '200 ml', purchasePricePerCase: 330, sellingPricePerCase: 360, profitPerCase: 30, currentStock: 180, minStockCases: 30, openingStock: 180, isActive: true },
    { _id: 'p9', flavor: 'Grape', bottleSize: '200 ml', purchasePricePerCase: 365, sellingPricePerCase: 400, profitPerCase: 35, currentStock: 70, minStockCases: 15, openingStock: 70, isActive: true },
    { _id: 'p10', flavor: 'Orange', bottleSize: '200 ml', purchasePricePerCase: 355, sellingPricePerCase: 390, profitPerCase: 35, currentStock: 110, minStockCases: 20, openingStock: 110, isActive: true },
    { _id: 'p11', flavor: 'Orange', bottleSize: '600 ml', purchasePricePerCase: 475, sellingPricePerCase: 515, profitPerCase: 40, currentStock: 40, minStockCases: 15, openingStock: 40, isActive: true },
    { _id: 'p12', flavor: 'Lemon Green', bottleSize: '200 ml', purchasePricePerCase: 340, sellingPricePerCase: 375, profitPerCase: 35, currentStock: 95, minStockCases: 20, openingStock: 95, isActive: true },
    { _id: 'p13', flavor: 'Cloudy Lemon', bottleSize: '600 ml', purchasePricePerCase: 490, sellingPricePerCase: 535, profitPerCase: 45, currentStock: 50, minStockCases: 15, openingStock: 50, isActive: true },
    { _id: 'p14', flavor: 'Cola', bottleSize: '200 ml', purchasePricePerCase: 380, sellingPricePerCase: 420, profitPerCase: 40, currentStock: 130, minStockCases: 25, openingStock: 130, isActive: true },
    { _id: 'p15', flavor: 'Cola', bottleSize: '1000 ml', purchasePricePerCase: 620, sellingPricePerCase: 680, profitPerCase: 60, currentStock: 8, minStockCases: 12, isActive: true },
    { _id: 'p16', flavor: 'Salt Soda', bottleSize: '200 ml', purchasePricePerCase: 310, sellingPricePerCase: 340, profitPerCase: 30, currentStock: 5, minStockCases: 15, isActive: true },
  ];

  memoryStore.products = initialProducts;

  const initialCustomers = [
    { _id: 'c1', name: 'Trisula Agencies', town: 'Terlam', phone: '9848012345', isActive: true },
    { _id: 'c2', name: 'Sri Lakshmi Traders', town: 'Bobbili', phone: '9440198765', isActive: true },
    { _id: 'c3', name: 'Venkateswara Soft Drinks', town: 'Vizianagaram', phone: '9866234567', isActive: true },
    { _id: 'c4', name: 'Royal Beverage Hub', town: 'Rajam', phone: '9989345678', isActive: true },
  ];

  memoryStore.customers = initialCustomers;

  // Add sample historical orders
  const now = new Date();
  const sampleOrders = [
    {
      _id: 'o1',
      orderNumber: 'ORD-20261005-001',
      orderDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      customer: 'c1',
      customerName: 'Trisula Agencies',
      town: 'Terlam',
      items: [
        { product: 'p1', flavor: 'Dew', bottleSize: '200 ml', cases: 15, sellingPrice: 390, purchasePrice: 360, profit: 450, totalPrice: 5850 },
        { product: 'p4', flavor: 'Mango', bottleSize: '200 ml', cases: 20, sellingPrice: 410, purchasePrice: 370, profit: 800, totalPrice: 8200 },
      ],
      totalCases: 35,
      totalBill: 14050,
      totalCost: 12800,
      totalProfit: 1250,
    },
    {
      _id: 'o2',
      orderNumber: 'ORD-20261006-002',
      orderDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      customer: 'c2',
      customerName: 'Sri Lakshmi Traders',
      town: 'Bobbili',
      items: [
        { product: 'p2', flavor: 'Dew', bottleSize: '600 ml', cases: 10, sellingPrice: 520, purchasePrice: 480, profit: 400, totalPrice: 5200 },
        { product: 'p5', flavor: 'Mango', bottleSize: '600 ml', cases: 12, sellingPrice: 550, purchasePrice: 500, profit: 600, totalPrice: 6600 },
      ],
      totalCases: 22,
      totalBill: 11800,
      totalCost: 10800,
      totalProfit: 1000,
    },
    {
      _id: 'o3',
      orderNumber: 'ORD-20261007-003',
      orderDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      customer: 'c3',
      customerName: 'Venkateswara Soft Drinks',
      town: 'Vizianagaram',
      items: [
        { product: 'p8', flavor: 'Jeera', bottleSize: '200 ml', cases: 25, sellingPrice: 360, purchasePrice: 330, profit: 750, totalPrice: 9000 },
        { product: 'p12', flavor: 'Lemon Green', bottleSize: '200 ml', cases: 18, sellingPrice: 375, purchasePrice: 340, profit: 630, totalPrice: 6750 },
      ],
      totalCases: 43,
      totalBill: 15750,
      totalCost: 14370,
      totalProfit: 1380,
    },
    {
      _id: 'o4',
      orderNumber: 'ORD-20261008-004',
      orderDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      customer: 'c4',
      customerName: 'Royal Beverage Hub',
      town: 'Rajam',
      items: [
        { product: 'p1', flavor: 'Dew', bottleSize: '200 ml', cases: 30, sellingPrice: 390, purchasePrice: 360, profit: 900, totalPrice: 11700 },
        { product: 'p14', flavor: 'Cola', bottleSize: '200 ml', cases: 20, sellingPrice: 420, purchasePrice: 380, profit: 800, totalPrice: 8400 },
      ],
      totalCases: 50,
      totalBill: 20100,
      totalCost: 18400,
      totalProfit: 1700,
    },
  ];

  memoryStore.orders = sampleOrders;
};

initializeMemoryData();

module.exports = {
  isDbConnected,
  memoryStore,
  initializeMemoryData,
};

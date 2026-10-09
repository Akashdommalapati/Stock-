const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const StockMovement = require('../models/StockMovement');
const Settings = require('../models/Settings');

const clearData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing all database collections from MongoDB Atlas...');
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await StockMovement.deleteMany({});
    await Settings.deleteMany({});

    // Seed default empty settings for flavors and bottle sizes so dropdowns work smoothly
    const defaultFlavors = [
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
    ];
    const defaultBottleSizes = ['180 ml', '200 ml', '600 ml', '1000 ml'];

    await Settings.create({ flavors: defaultFlavors, bottleSizes: defaultBottleSizes });

    console.log('✅ Database cleared successfully! Default flavors & bottle sizes settings initialized.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Clear data error:', error);
    process.exit(1);
  }
};

clearData();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const StockMovement = require('../models/StockMovement');
const Settings = require('../models/Settings');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await StockMovement.deleteMany({});
    await Settings.deleteMany({});

    console.log('Seeding Flavors and Bottle Sizes settings...');
    const flavors = [
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
    const bottleSizes = ['180 ml', '200 ml', '600 ml', '1000 ml'];

    await Settings.create({ flavors, bottleSizes });

    console.log('Seeding Sample Product Variants...');
    const sampleVariants = [
      { flavor: 'Dew', bottleSize: '200 ml', purchasePricePerCase: 360, sellingPricePerCase: 390, openingStock: 120, minStockCases: 20 },
      { flavor: 'Dew', bottleSize: '600 ml', purchasePricePerCase: 480, sellingPricePerCase: 520, openingStock: 80, minStockCases: 15 },
      { flavor: 'Mauser', bottleSize: '200 ml', purchasePricePerCase: 350, sellingPricePerCase: 380, openingStock: 100, minStockCases: 20 },
      { flavor: 'Mango', bottleSize: '200 ml', purchasePricePerCase: 370, sellingPricePerCase: 410, openingStock: 150, minStockCases: 25 },
      { flavor: 'Mango', bottleSize: '600 ml', purchasePricePerCase: 500, sellingPricePerCase: 550, openingStock: 60, minStockCases: 15 },
      { flavor: 'Pineapple', bottleSize: '200 ml', purchasePricePerCase: 360, sellingPricePerCase: 395, openingStock: 90, minStockCases: 20 },
      { flavor: 'Guava', bottleSize: '200 ml', purchasePricePerCase: 375, sellingPricePerCase: 415, openingStock: 75, minStockCases: 15 },
      { flavor: 'Jeera', bottleSize: '200 ml', purchasePricePerCase: 330, sellingPricePerCase: 360, openingStock: 180, minStockCases: 30 },
      { flavor: 'Grape', bottleSize: '200 ml', purchasePricePerCase: 365, sellingPricePerCase: 400, openingStock: 70, minStockCases: 15 },
      { flavor: 'Orange', bottleSize: '200 ml', purchasePricePerCase: 355, sellingPricePerCase: 390, openingStock: 110, minStockCases: 20 },
      { flavor: 'Orange', bottleSize: '600 ml', purchasePricePerCase: 475, sellingPricePerCase: 515, openingStock: 40, minStockCases: 15 },
      { flavor: 'Lemon Green', bottleSize: '200 ml', purchasePricePerCase: 340, sellingPricePerCase: 375, openingStock: 95, minStockCases: 20 },
      { flavor: 'Cloudy Lemon', bottleSize: '600 ml', purchasePricePerCase: 490, sellingPricePerCase: 535, openingStock: 50, minStockCases: 15 },
      { flavor: 'Cola', bottleSize: '200 ml', purchasePricePerCase: 380, sellingPricePerCase: 420, openingStock: 130, minStockCases: 25 },
      { flavor: 'Cola', bottleSize: '1000 ml', purchasePricePerCase: 620, sellingPricePerCase: 680, openingStock: 8, minStockCases: 12 }, // Low stock sample!
      { flavor: 'Salt Soda', bottleSize: '200 ml', purchasePricePerCase: 310, sellingPricePerCase: 340, openingStock: 5, minStockCases: 15 }, // Low stock sample!
    ];

    const createdProducts = [];
    for (const v of sampleVariants) {
      const p = new Product({
        ...v,
        currentStock: v.openingStock,
        profitPerCase: v.sellingPricePerCase - v.purchasePricePerCase,
      });
      await p.save();
      createdProducts.push(p);

      // Record initial stock received movement
      await StockMovement.create({
        product: p._id,
        type: 'RECEIVED',
        cases: v.openingStock,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        reference: 'Opening Stock',
        reason: 'Godown Initial Inventory Setup',
      });
    }

    console.log(`Seeded ${createdProducts.length} Product Variants.`);

    console.log('Seeding Sample Customers...');
    const customerData = [
      { name: 'Trisula Agencies', town: 'Terlam', phone: '9848012345' },
      { name: 'Sri Lakshmi Traders', town: 'Bobbili', phone: '9440198765' },
      { name: 'Venkateswara Soft Drinks', town: 'Vizianagaram', phone: '9866234567' },
      { name: 'Royal Beverage Hub', town: 'Rajam', phone: '9989345678' },
    ];

    const createdCustomers = await Customer.insertMany(customerData);
    console.log(`Seeded ${createdCustomers.length} Customers.`);

    console.log('Seeding Sample Past Orders...');

    const now = new Date();
    const createSampleOrder = async (daysAgo, customerIndex, itemIndices, seqNum) => {
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - daysAgo);

      const customer = createdCustomers[customerIndex];
      const items = [];
      let totalCases = 0;
      let totalBill = 0;
      let totalCost = 0;
      let totalProfit = 0;

      for (const { prodIdx, cases } of itemIndices) {
        const prod = createdProducts[prodIdx];
        const sellingPrice = prod.sellingPricePerCase;
        const purchasePrice = prod.purchasePricePerCase;
        const profit = (sellingPrice - purchasePrice) * cases;
        const totalPrice = sellingPrice * cases;

        items.push({
          product: prod._id,
          flavor: prod.flavor,
          bottleSize: prod.bottleSize,
          cases,
          sellingPrice,
          purchasePrice,
          profit,
          totalPrice,
        });

        totalCases += cases;
        totalBill += totalPrice;
        totalCost += purchasePrice * cases;
        totalProfit += profit;

        // Deduct from current stock & add movement
        prod.currentStock -= cases;
        await prod.save();

        await StockMovement.create({
          product: prod._id,
          type: 'SOLD',
          cases: -cases,
          date: orderDate,
          reference: `ORD-SEED-${seqNum}`,
          reason: `Sold to ${customer.name} (${customer.town})`,
        });
      }

      const dateStr = orderDate.toISOString().slice(0, 10).replace(/-/g, '');
      const orderNumber = `ORD-${dateStr}-${String(seqNum).padStart(3, '0')}`;

      await Order.create({
        orderNumber,
        orderDate,
        customer: customer._id,
        customerName: customer.name,
        town: customer.town,
        items,
        totalCases,
        totalBill,
        totalCost,
        totalProfit,
      });
    };

    // Orders over past 5 days
    await createSampleOrder(4, 0, [{ prodIdx: 0, cases: 15 }, { prodIdx: 3, cases: 20 }], 1);
    await createSampleOrder(3, 1, [{ prodIdx: 1, cases: 10 }, { prodIdx: 4, cases: 12 }], 2);
    await createSampleOrder(2, 2, [{ prodIdx: 7, cases: 25 }, { prodIdx: 11, cases: 18 }], 3);
    await createSampleOrder(1, 3, [{ prodIdx: 0, cases: 30 }, { prodIdx: 13, cases: 20 }], 4);
    await createSampleOrder(0, 0, [{ prodIdx: 3, cases: 25 }, { prodIdx: 7, cases: 15 }], 5);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

const Customer = require('../models/Customer');
const Order = require('../models/Order');

// Get all customers
exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({ isActive: true }).sort({ name: 1 });

    // Attach brief total orders summary for each customer
    const customersWithSummary = await Promise.all(
      customers.map(async (c) => {
        const orderStats = await Order.aggregate([
          { $match: { customer: c._id } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalCases: { $sum: '$totalCases' },
              totalBill: { $sum: '$totalBill' },
            },
          },
        ]);

        const stats = orderStats[0] || { totalOrders: 0, totalCases: 0, totalBill: 0 };
        return {
          ...c.toObject(),
          totalOrders: stats.totalOrders,
          totalCases: stats.totalCases,
          totalBill: stats.totalBill,
        };
      })
    );

    res.json(customersWithSummary);
  } catch (error) {
    next(error);
  }
};

// Create new Customer
exports.createCustomer = async (req, res, next) => {
  try {
    const { name, town, phone } = req.body;

    if (!name || !town) {
      return res.status(400).json({ message: 'Customer/Agency name and town are required.' });
    }

    const existing = await Customer.findOne({ name: name.trim(), town: town.trim() });
    if (existing) {
      return res.status(400).json({ message: `Customer "${name}" in "${town}" already exists.` });
    }

    const customer = new Customer({
      name: name.trim(),
      town: town.trim(),
      phone: phone ? phone.trim() : '',
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

// Update Customer
exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, town, phone, isActive } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    if (name) customer.name = name.trim();
    if (town) customer.town = town.trim();
    if (phone !== undefined) customer.phone = phone.trim();
    if (isActive !== undefined) customer.isActive = Boolean(isActive);

    await customer.save();
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

// Customer Detail Page API
exports.getCustomerDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const orders = await Order.find({ customer: id }).sort({ orderDate: -1 });

    // Aggregate flavor & bottle size purchase breakdown
    const productBreakdown = {};
    let grandTotalCases = 0;
    let grandTotalBill = 0;

    orders.forEach((order) => {
      grandTotalCases += order.totalCases;
      grandTotalBill += order.totalBill;

      order.items.forEach((item) => {
        const key = `${item.flavor} (${item.bottleSize})`;
        if (!productBreakdown[key]) {
          productBreakdown[key] = {
            flavor: item.flavor,
            bottleSize: item.bottleSize,
            totalCases: 0,
            totalAmount: 0,
          };
        }
        productBreakdown[key].totalCases += item.cases;
        productBreakdown[key].totalAmount += item.totalPrice;
      });
    });

    const productStats = Object.values(productBreakdown).sort((a, b) => b.totalCases - a.totalCases);

    res.json({
      customer,
      orders,
      summary: {
        totalOrders: orders.length,
        totalCases: grandTotalCases,
        totalBill: grandTotalBill,
        topProducts: productStats.slice(0, 5),
        productStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

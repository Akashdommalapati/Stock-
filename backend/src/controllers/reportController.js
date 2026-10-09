const Order = require('../models/Order');
const Product = require('../models/Product');

// Get Dashboard Summary Stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    // Start of Today
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);

    // Start of Week (Sunday/Monday - let's set 7 days ago)
    const startWeek = new Date(now);
    startWeek.setDate(now.getDate() - 6);
    startWeek.setHours(0, 0, 0, 0);

    // Start of Month
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Helper aggregator
    const getMetricsForRange = async (startDate, endDate) => {
      const match = { orderDate: { $gte: startDate } };
      if (endDate) match.orderDate.$lte = endDate;

      const stats = await Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$totalBill' },
            cases: { $sum: '$totalCases' },
            cost: { $sum: '$totalCost' },
            profit: { $sum: '$totalProfit' },
          },
        },
      ]);

      return stats[0] || { revenue: 0, cases: 0, cost: 0, profit: 0 };
    };

    const todayStats = await getMetricsForRange(startToday);
    const weekStats = await getMetricsForRange(startWeek);
    const monthStats = await getMetricsForRange(startMonth);

    // Low stock products count & items
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$currentStock', '$minStockCases'] },
    }).sort({ currentStock: 1 });

    // Top 5 Best Selling Variants (all time or this month)
    const topSellersAgg = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: { flavor: '$items.flavor', bottleSize: '$items.bottleSize' },
          totalCases: { $sum: '$items.cases' },
          totalRevenue: { $sum: '$items.totalPrice' },
          totalProfit: { $sum: '$items.profit' },
        },
      },
      { $sort: { totalCases: -1 } },
      { $limit: 5 },
    ]);

    const topSellers = topSellersAgg.map((item) => ({
      name: `${item._id.flavor} (${item._id.bottleSize})`,
      flavor: item._id.flavor,
      bottleSize: item._id.bottleSize,
      cases: item.totalCases,
      revenue: item.totalRevenue,
      profit: item.totalProfit,
    }));

    // Last 7 days Sales & Profit Chart Data
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const dayMetrics = await getMetricsForRange(dayStart, dayEnd);
      const dateLabel = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

      chartData.push({
        date: dateLabel,
        rawDate: dayStart.toISOString().slice(0, 10),
        revenue: dayMetrics.revenue,
        profit: dayMetrics.profit,
        cases: dayMetrics.cases,
      });
    }

    res.json({
      today: todayStats,
      week: weekStats,
      month: monthStats,
      lowStockCount: lowStockProducts.length,
      lowStockItems: lowStockProducts,
      topSellers,
      chartData,
    });
  } catch (error) {
    next(error);
  }
};

// Comprehensive Reports
exports.getReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) query.orderDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.orderDate.$lte = end;
      }
    }

    const orders = await Order.find(query).sort({ orderDate: -1 });

    let totalRevenue = 0;
    let totalCases = 0;
    let totalCost = 0;
    let totalProfit = 0;

    const customerSummary = {};
    const productSummary = {};

    orders.forEach((order) => {
      totalRevenue += order.totalBill;
      totalCases += order.totalCases;
      totalCost += order.totalCost;
      totalProfit += order.totalProfit;

      // Customer Summary
      const custKey = `${order.customerName} (${order.town})`;
      if (!customerSummary[custKey]) {
        customerSummary[custKey] = {
          customerName: order.customerName,
          town: order.town,
          orderCount: 0,
          totalCases: 0,
          totalRevenue: 0,
          totalProfit: 0,
        };
      }
      customerSummary[custKey].orderCount += 1;
      customerSummary[custKey].totalCases += order.totalCases;
      customerSummary[custKey].totalRevenue += order.totalBill;
      customerSummary[custKey].totalProfit += order.totalProfit;

      // Product Summary
      order.items.forEach((item) => {
        const prodKey = `${item.flavor} (${item.bottleSize})`;
        if (!productSummary[prodKey]) {
          productSummary[prodKey] = {
            flavor: item.flavor,
            bottleSize: item.bottleSize,
            cases: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
          };
        }
        productSummary[prodKey].cases += item.cases;
        productSummary[prodKey].revenue += item.totalPrice;
        productSummary[prodKey].cost += item.cases * item.purchasePrice;
        productSummary[prodKey].profit += item.profit;
      });
    });

    res.json({
      summary: {
        totalOrders: orders.length,
        totalRevenue,
        totalCases,
        totalCost,
        totalProfit,
      },
      customerSummary: Object.values(customerSummary).sort((a, b) => b.totalRevenue - a.totalRevenue),
      productSummary: Object.values(productSummary).sort((a, b) => b.cases - a.cases),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

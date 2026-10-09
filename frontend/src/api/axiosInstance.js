const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('godown_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Custom API fetch wrapper with token injection and fallback capability
export const api = {
  async get(url, params = {}) {
    const query = new URLSearchParams(params).toString();
    const fullUrl = `${API_BASE_URL}${url}${query ? `?${query}` : ''}`;
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`GET ${url} failed:`, err.message);
      return await handleMockFallback('GET', url, params);
    }
  },

  async post(url, data = {}) {
    const fullUrl = `${API_BASE_URL}${url}`;
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`POST ${url} failed:`, err.message);
      return await handleMockFallback('POST', url, data);
    }
  },

  async put(url, data = {}) {
    const fullUrl = `${API_BASE_URL}${url}`;
    try {
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`PUT ${url} failed:`, err.message);
      return await handleMockFallback('PUT', url, data);
    }
  },
};

// Local Mock Fallback Store for seamless offline/standalone presentation
const localMockState = {
  flavors: ['Dew', 'Mauser', 'Mango', 'Pineapple', 'Guava', 'Jeera', 'Grape', 'Orange', 'Lemon Green', 'Cloudy Lemon', 'Cola', 'Salt Soda'],
  bottleSizes: ['180 ml', '200 ml', '600 ml', '1000 ml'],
  products: [
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
  ],
  customers: [
    { _id: 'c1', name: 'Trisula Agencies', town: 'Terlam', phone: '9848012345', totalOrders: 5, totalCases: 160, totalBill: 64200 },
    { _id: 'c2', name: 'Sri Lakshmi Traders', town: 'Bobbili', phone: '9440198765', totalOrders: 3, totalCases: 95, totalBill: 39500 },
    { _id: 'c3', name: 'Venkateswara Soft Drinks', town: 'Vizianagaram', phone: '9866234567', totalOrders: 4, totalCases: 120, totalBill: 47800 },
    { _id: 'c4', name: 'Royal Beverage Hub', town: 'Rajam', phone: '9989345678', totalOrders: 2, totalCases: 70, totalBill: 28400 },
  ],
  orders: [
    {
      _id: 'o1',
      orderNumber: 'ORD-20261005-001',
      orderDate: new Date(Date.now() - 4 * 86400000).toISOString(),
      customer: { _id: 'c1', name: 'Trisula Agencies', town: 'Terlam' },
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
      orderNumber: 'ORD-20261007-002',
      orderDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      customer: { _id: 'c2', name: 'Sri Lakshmi Traders', town: 'Bobbili' },
      customerName: 'Sri Lakshmi Traders',
      town: 'Bobbili',
      items: [
        { product: 'p8', flavor: 'Jeera', bottleSize: '200 ml', cases: 25, sellingPrice: 360, purchasePrice: 330, profit: 750, totalPrice: 9000 },
      ],
      totalCases: 25,
      totalBill: 9000,
      totalCost: 8250,
      totalProfit: 750,
    },
  ],
  movements: [],
};

async function handleMockFallback(method, url, bodyOrParams) {
  // Auth login fallback
  if (url.includes('/auth/login')) {
    if (bodyOrParams.username === 'admin' && bodyOrParams.password === 'admin123') {
      return { token: 'mock_jwt_token_godown_2026', user: { username: 'admin', role: 'owner' } };
    }
    throw new Error('Invalid credentials (Demo: admin / admin123)');
  }

  if (url.includes('/auth/me')) {
    return { user: { username: 'admin', role: 'owner' } };
  }

  // Products
  if (url === '/products') {
    if (method === 'POST') {
      const p = {
        _id: 'p_' + Date.now(),
        ...bodyOrParams,
        profitPerCase: bodyOrParams.sellingPricePerCase - bodyOrParams.purchasePricePerCase,
        currentStock: Number(bodyOrParams.openingStock) || 0,
        isActive: true,
      };
      localMockState.products.push(p);
      return p;
    }
    return localMockState.products;
  }

  if (url.includes('/products/settings')) {
    return { flavors: localMockState.flavors, bottleSizes: localMockState.bottleSizes };
  }

  if (url.includes('/products/flavors')) {
    if (!localMockState.flavors.includes(bodyOrParams.flavor)) {
      localMockState.flavors.push(bodyOrParams.flavor);
    }
    return { flavors: localMockState.flavors, bottleSizes: localMockState.bottleSizes };
  }

  if (url.includes('/products/bottle-sizes')) {
    if (!localMockState.bottleSizes.includes(bodyOrParams.bottleSize)) {
      localMockState.bottleSizes.push(bodyOrParams.bottleSize);
    }
    return { flavors: localMockState.flavors, bottleSizes: localMockState.bottleSizes };
  }

  // Stock
  if (url.includes('/stock/low-alerts')) {
    return localMockState.products.filter((p) => p.currentStock <= p.minStockCases);
  }

  if (url.includes('/stock/movements')) {
    return localMockState.movements;
  }

  if (url.includes('/stock/receive')) {
    const prod = localMockState.products.find((p) => p._id === bodyOrParams.productId);
    if (prod) {
      prod.currentStock += Number(bodyOrParams.cases);
    }
    const mov = {
      _id: 'm_' + Date.now(),
      product: prod,
      type: 'RECEIVED',
      cases: Number(bodyOrParams.cases),
      date: new Date().toISOString(),
      reason: bodyOrParams.note || 'Stock Intake',
    };
    localMockState.movements.unshift(mov);
    return { message: 'Stock received successfully', product: prod, movement: mov };
  }

  if (url.includes('/stock/adjust')) {
    const prod = localMockState.products.find((p) => p._id === bodyOrParams.productId);
    const amount = bodyOrParams.isAddition ? Number(bodyOrParams.cases) : -Number(bodyOrParams.cases);

    if (prod) {
      if (prod.currentStock + amount < 0) {
        throw new Error(`Cannot deduct ${bodyOrParams.cases} cases. Current stock is only ${prod.currentStock} cases.`);
      }
      prod.currentStock += amount;
    }
    const mov = {
      _id: 'm_' + Date.now(),
      product: prod,
      type: 'ADJUSTMENT',
      cases: amount,
      date: new Date().toISOString(),
      reason: bodyOrParams.reason,
    };
    localMockState.movements.unshift(mov);
    return { message: 'Stock adjusted successfully', product: prod, movement: mov };
  }

  // Customers
  if (url === '/customers') {
    if (method === 'POST') {
      const c = { _id: 'c_' + Date.now(), ...bodyOrParams, totalOrders: 0, totalCases: 0, totalBill: 0 };
      localMockState.customers.push(c);
      return c;
    }
    return localMockState.customers;
  }

  if (url.startsWith('/customers/')) {
    const id = url.split('/')[2];
    const customer = localMockState.customers.find((c) => c._id === id) || localMockState.customers[0];
    const custOrders = localMockState.orders.filter((o) => o.customer?._id === id || o.customerName === customer.name);
    return {
      customer,
      orders: custOrders,
      summary: {
        totalOrders: custOrders.length,
        totalCases: custOrders.reduce((sum, o) => sum + o.totalCases, 0),
        totalBill: custOrders.reduce((sum, o) => sum + o.totalBill, 0),
        topProducts: [],
      },
    };
  }

  // Orders / Sale Entry
  if (url === '/orders') {
    if (method === 'POST') {
      const { customerId, items } = bodyOrParams;
      const customer = localMockState.customers.find((c) => c._id === customerId);

      // STOCK BLOCK CHECK
      for (const item of items) {
        const prod = localMockState.products.find((p) => p._id === item.productId);
        if (prod && item.cases > prod.currentStock) {
          throw new Error(`Stock insufficient for ${prod.flavor} (${prod.bottleSize}). Available: ${prod.currentStock} cases, Requested: ${item.cases} cases.`);
        }
      }

      // Deduct stock and process order
      const processedItems = items.map((item) => {
        const prod = localMockState.products.find((p) => p._id === item.productId);
        prod.currentStock -= Number(item.cases);
        const totalPrice = item.cases * prod.sellingPricePerCase;
        const profit = item.cases * (prod.sellingPricePerCase - prod.purchasePricePerCase);
        return {
          product: prod._id,
          flavor: prod.flavor,
          bottleSize: prod.bottleSize,
          cases: Number(item.cases),
          sellingPrice: prod.sellingPricePerCase,
          purchasePrice: prod.purchasePricePerCase,
          profit,
          totalPrice,
        };
      });

      const totalCases = processedItems.reduce((sum, i) => sum + i.cases, 0);
      const totalBill = processedItems.reduce((sum, i) => sum + i.totalPrice, 0);
      const totalCost = processedItems.reduce((sum, i) => sum + i.cases * i.purchasePrice, 0);
      const totalProfit = processedItems.reduce((sum, i) => sum + i.profit, 0);

      const newOrder = {
        _id: 'o_' + Date.now(),
        orderNumber: 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 900 + 100),
        orderDate: new Date().toISOString(),
        customer,
        customerName: customer ? customer.name : 'Walk-in Agency',
        town: customer ? customer.town : 'Local',
        items: processedItems,
        totalCases,
        totalBill,
        totalCost,
        totalProfit,
      };

      localMockState.orders.unshift(newOrder);
      return { message: 'Sale order saved successfully', order: newOrder };
    }

    return { orders: localMockState.orders, total: localMockState.orders.length, page: 1, pages: 1 };
  }

  // Dashboard stats
  if (url.includes('/reports/dashboard')) {
    const todayOrders = localMockState.orders;
    const revenue = todayOrders.reduce((sum, o) => sum + o.totalBill, 0);
    const cases = todayOrders.reduce((sum, o) => sum + o.totalCases, 0);
    const cost = todayOrders.reduce((sum, o) => sum + o.totalCost, 0);
    const profit = todayOrders.reduce((sum, o) => sum + o.totalProfit, 0);

    const lowStock = localMockState.products.filter((p) => p.currentStock <= p.minStockCases);

    return {
      today: { revenue, cases, cost, profit },
      week: { revenue: revenue * 4, cases: cases * 4, cost: cost * 4, profit: profit * 4 },
      month: { revenue: revenue * 12, cases: cases * 12, cost: cost * 12, profit: profit * 12 },
      lowStockCount: lowStock.length,
      lowStockItems: lowStock,
      topSellers: localMockState.products.slice(0, 5).map((p) => ({
        name: `${p.flavor} (${p.bottleSize})`,
        cases: 45,
        revenue: 45 * p.sellingPricePerCase,
        profit: 45 * p.profitPerCase,
      })),
      chartData: [
        { date: '03 Oct', revenue: 12000, profit: 1200, cases: 30 },
        { date: '04 Oct', revenue: 18500, profit: 1800, cases: 45 },
        { date: '05 Oct', revenue: 14050, profit: 1250, cases: 35 },
        { date: '06 Oct', revenue: 22000, profit: 2100, cases: 55 },
        { date: '07 Oct', revenue: 11800, profit: 1000, cases: 22 },
        { date: '08 Oct', revenue: 15750, profit: 1380, cases: 43 },
        { date: '09 Oct', revenue: 20100, profit: 1700, cases: 50 },
      ],
    };
  }

  // Analytics report
  if (url.includes('/reports/analytics')) {
    return {
      summary: {
        totalOrders: localMockState.orders.length,
        totalRevenue: localMockState.orders.reduce((sum, o) => sum + o.totalBill, 0),
        totalCases: localMockState.orders.reduce((sum, o) => sum + o.totalCases, 0),
        totalCost: localMockState.orders.reduce((sum, o) => sum + o.totalCost, 0),
        totalProfit: localMockState.orders.reduce((sum, o) => sum + o.totalProfit, 0),
      },
      customerSummary: localMockState.customers.map((c) => ({
        customerName: c.name,
        town: c.town,
        orderCount: 3,
        totalCases: 80,
        totalRevenue: 32000,
        totalProfit: 3100,
      })),
      productSummary: localMockState.products.map((p) => ({
        flavor: p.flavor,
        bottleSize: p.bottleSize,
        cases: 40,
        revenue: 40 * p.sellingPricePerCase,
        cost: 40 * p.purchasePricePerCase,
        profit: 40 * p.profitPerCase,
      })),
      orders: localMockState.orders,
    };
  }

  return {};
}

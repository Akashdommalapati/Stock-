const Product = require('../models/Product');
const Settings = require('../models/Settings');

// Get all products
exports.getProducts = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    const products = await Product.find(filter).sort({ flavor: 1, bottleSize: 1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Create a new product variant
exports.createProduct = async (req, res, next) => {
  try {
    const {
      flavor,
      bottleSize,
      purchasePricePerCase,
      sellingPricePerCase,
      minStockCases,
      openingStock,
    } = req.body;

    if (!flavor || !bottleSize) {
      return res.status(400).json({ message: 'Flavor and bottle size are required.' });
    }

    if (purchasePricePerCase < 0 || sellingPricePerCase < 0) {
      return res.status(400).json({ message: 'Prices cannot be negative.' });
    }

    const existing = await Product.findOne({ flavor, bottleSize });
    if (existing) {
      return res.status(400).json({
        message: `Product variant "${flavor} - ${bottleSize}" already exists.`,
      });
    }

    const initialStock = Number(openingStock) || 0;
    const profit = Number(sellingPricePerCase) - Number(purchasePricePerCase);

    const product = new Product({
      flavor,
      bottleSize,
      purchasePricePerCase,
      sellingPricePerCase,
      profitPerCase: profit,
      minStockCases: Number(minStockCases) || 10,
      openingStock: initialStock,
      currentStock: initialStock,
    });

    await product.save();

    // Ensure flavor and size exist in Settings
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (!settings.flavors.includes(flavor)) {
      settings.flavors.push(flavor);
    }
    if (!settings.bottleSizes.includes(bottleSize)) {
      settings.bottleSizes.push(bottleSize);
    }
    await settings.save();

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      purchasePricePerCase,
      sellingPricePerCase,
      minStockCases,
      isActive,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product variant not found.' });
    }

    if (purchasePricePerCase !== undefined) product.purchasePricePerCase = Number(purchasePricePerCase);
    if (sellingPricePerCase !== undefined) product.sellingPricePerCase = Number(sellingPricePerCase);
    if (minStockCases !== undefined) product.minStockCases = Number(minStockCases);
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    product.profitPerCase = product.sellingPricePerCase - product.purchasePricePerCase;

    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Get settings (flavors and bottle sizes list)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// Add new flavor
exports.addFlavor = async (req, res, next) => {
  try {
    const { flavor } = req.body;
    if (!flavor || !flavor.trim()) {
      return res.status(400).json({ message: 'Flavor name is required.' });
    }
    const cleanFlavor = flavor.trim();
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (!settings.flavors.includes(cleanFlavor)) {
      settings.flavors.push(cleanFlavor);
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// Add new bottle size
exports.addBottleSize = async (req, res, next) => {
  try {
    const { bottleSize } = req.body;
    if (!bottleSize || !bottleSize.trim()) {
      return res.status(400).json({ message: 'Bottle size is required.' });
    }
    const cleanSize = bottleSize.trim();
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (!settings.bottleSizes.includes(cleanSize)) {
      settings.bottleSizes.push(cleanSize);
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

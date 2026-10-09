const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    flavor: {
      type: String,
      required: [true, 'Flavor is required'],
      trim: true,
    },
    bottleSize: {
      type: String,
      required: [true, 'Bottle size is required'],
      trim: true,
    },
    purchasePricePerCase: {
      type: Number,
      required: [true, 'Purchase price per case is required'],
      min: [0, 'Purchase price cannot be negative'],
    },
    sellingPricePerCase: {
      type: Number,
      required: [true, 'Selling price per case is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    profitPerCase: {
      type: Number,
      default: 0,
    },
    minStockCases: {
      type: Number,
      default: 10,
      min: [0, 'Minimum stock cases cannot be negative'],
    },
    openingStock: {
      type: Number,
      default: 0,
      min: [0, 'Opening stock cannot be negative'],
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Unique compound index on flavor + bottleSize
productSchema.index({ flavor: 1, bottleSize: 1 }, { unique: true });

// Pre-save hook to calculate profit per case
productSchema.pre('save', function (next) {
  this.profitPerCase = (this.sellingPricePerCase || 0) - (this.purchasePricePerCase || 0);
  next();
});

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: {
      type: String,
      enum: ['RECEIVED', 'SOLD', 'ADJUSTMENT'],
      required: true,
    },
    cases: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reference: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockMovement', stockMovementSchema);

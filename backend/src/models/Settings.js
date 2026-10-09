const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    flavors: {
      type: [String],
      default: [
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
    },
    bottleSizes: {
      type: [String],
      default: ['180 ml', '200 ml', '600 ml', '1000 ml'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);

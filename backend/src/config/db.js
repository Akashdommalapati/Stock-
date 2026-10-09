const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const connectDB = async () => {
  // If an Atlas URI is configured, always use it
  if (MONGODB_URI && MONGODB_URI.startsWith('mongodb')) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 20000,
        connectTimeoutMS: 15000,
        retryWrites: true,
      });
      console.log(`✅ Connected to MongoDB Atlas — DB: ${mongoose.connection.db.databaseName}`);
      return;
    } catch (atlasErr) {
      console.error('❌ MongoDB Atlas connection failed:', atlasErr.message);
      console.error('Please check your MONGODB_URI and Atlas credentials.');
      process.exit(1); // Exit so the error is visible — don't silently fall back in production
    }
  }

  // No URI configured at all — only for bare dev environments
  console.warn('⚠️  No MONGODB_URI provided in .env. Please configure your Atlas connection string.');
  process.exit(1);
};

module.exports = connectDB;

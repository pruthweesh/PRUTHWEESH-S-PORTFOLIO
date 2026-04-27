const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection successful');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}
testConnection();

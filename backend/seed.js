require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit();
    }

    const admin = new User({
      email: 'admin@pruthweesh.com',
      password: 'password123', // User should change this immediately
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@pruthweesh.com');
    console.log('Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();

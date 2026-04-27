require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for admin update...');

    // Delete the old admin if they exist
    await User.deleteMany({ role: 'admin' });

    // Create the new admin with the user's requested credentials
    const newAdmin = new User({
      email: 'pruthweesh2006@gmail.com',
      password: 'Valarmathi@1',
      role: 'admin',
    });

    await newAdmin.save();
    console.log('Admin user updated successfully!');
    console.log('Email: pruthweesh2006@gmail.com');
    console.log('Password: Valarmathi@1');
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin user:', error);
    process.exit(1);
  }
};

updateAdmin();

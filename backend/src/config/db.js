const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debug log to show the connection string being used (with password masked)
    const maskedUri = process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@');
    console.log(`Attempting to connect to MongoDB with URI: ${maskedUri}`);
    console.log("USING MONGO URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`\n💡 TIP: If you are getting an 'authentication failed' error:
    1. Check if the password in your .env file is correct.
    2. Check if the database user 'portfolioAdmin' actually exists in MongoDB Atlas under 'Database Access'.
    3. If your password has special characters like '@', ensure they are URL-encoded (e.g., '@' becomes '%40').
    4. Ensure your current IP Address is added to the 'Network Access' whitelist in MongoDB Atlas.\n`);
  }
};

module.exports = connectDB;

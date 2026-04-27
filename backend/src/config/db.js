const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mask the URI for security: hide the password
    const maskedUri = process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@');
    console.log(`Attempting to connect to MongoDB...`);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`\n💡 TROUBLESHOOTING TIP:
    If you changed your password and updated the .env file but it's not working:
    1. Special Characters: If your password has symbols like @, #, $, etc., you MUST URL-encode them.
       (Example: '@' becomes '%40', '#' becomes '%23')
    2. Atlas Access: Ensure the 'portfolioAdmin' user exists in your MongoDB Atlas 'Database Access' tab.
    3. IP Whitelist: Ensure your current IP is added to the 'Network Access' tab in Atlas.
    4. Restart: Nodemon should restart automatically, but try restarting the backend manually if needed.\n`);
  }
};

module.exports = connectDB;

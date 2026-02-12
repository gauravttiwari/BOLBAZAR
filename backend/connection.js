const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const url = process.env.MONGODB_URI || "mongodb+srv://bolbazarmart_db_user:b22ig6dl5rFzf0Cu@bolbazarmart.bukzplf.mongodb.net/?appName=bolbazarmart"

// Connection options with retry logic
const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
};

// Connect with retry logic
let retryCount = 0;
const maxRetries = 3;

const connectWithRetry = () => {
    mongoose.connect(url, options)
    .then(() => {
        console.log('✅ Database connected successfully');
        retryCount = 0;
    })
    .catch((err) => {
        console.error('❌ Database connection error:', err.message);
        retryCount++;
        
        if (retryCount <= maxRetries) {
            console.log(`🔄 Retrying connection... (Attempt ${retryCount}/${maxRetries})`);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.error('⚠️  Max retries reached. Server will continue without database.');
            console.log('💡 Tip: Check your internet connection and MongoDB Atlas IP whitelist.');
        }
    });
};

connectWithRetry();

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    connectWithRetry();
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
});

module.exports = mongoose;
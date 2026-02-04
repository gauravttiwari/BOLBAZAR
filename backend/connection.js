const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const url = process.env.MONGODB_URI || "mongodb+srv://bolbazarmart_db_user:b22ig6dl5rFzf0Cu@bolbazarmart.bukzplf.mongodb.net/?appName=bolbazarmart"

mongoose.connect(url)
.then((result)=>{
    console.log('database connected successfully');
}).catch((err)=>{
    console.error('Database connection error:', err);
});

module.exports = mongoose;
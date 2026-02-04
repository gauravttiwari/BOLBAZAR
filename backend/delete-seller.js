// Delete seller from MongoDB - Run this in backend terminal

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://gaurav:gaurav@bolbazarmart.bukzplf.mongodb.net/bolbazar?retryWrites=true&w=majority')
  .then(async () => {
    const Seller = require('./models/sellerModel');
    
    // Delete seller by email
    const email = 'deepak@gmail.com'; // Change this to your email
    const result = await Seller.deleteOne({ email });
    
    console.log('🗑️  Deleted seller:', result);
    console.log('✅ Now do fresh signup!');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

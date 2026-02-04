const Product = require('./models/productModel');
require('./connection'); // Use existing connection

console.log('🔄 Updating product...');

// Update the iPhone 17 product to add subcategory
Product.updateOne(
  { pname: 'i phone 17' },
  { $set: { subcategory: 'Mobiles' } }
)
  .then((result) => {
    console.log('✅ Product updated:', result);
    console.log(`Modified ${result.modifiedCount} product(s)`);
    
    // Verify the update
    return Product.findOne({ pname: 'i phone 17' });
  })
  .then((product) => {
    console.log('✅ Updated product:', product);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

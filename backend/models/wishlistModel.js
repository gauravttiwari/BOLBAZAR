const { Schema, model } = require('../connection');

const wishlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    addedAt: { type: Date, default: Date.now }
});

// Create a compound index to ensure a user can only add a product once
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = model('wishlist', wishlistSchema);

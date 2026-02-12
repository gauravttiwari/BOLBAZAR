const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');

// Add item to wishlist
router.post('/add', async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'UserId and ProductId are required' });
        }

        // Check if already in wishlist
        const existing = await Wishlist.findOne({ userId, productId });
        if (existing) {
            return res.status(200).json({ message: 'Already in wishlist', wishlist: existing });
        }

        const wishlistItem = new Wishlist({ userId, productId });
        await wishlistItem.save();

        res.status(201).json({ message: 'Added to wishlist', wishlist: wishlistItem });
    } catch (err) {
        console.error('Error adding to wishlist:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Remove item from wishlist
router.delete('/remove/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const result = await Wishlist.findOneAndDelete({ userId, productId });
        
        if (!result) {
            return res.status(404).json({ message: 'Item not found in wishlist' });
        }

        res.status(200).json({ message: 'Removed from wishlist' });
    } catch (err) {
        console.error('Error removing from wishlist:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get user's wishlist with product details
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const wishlistItems = await Wishlist.find({ userId })
            .populate('productId')
            .sort({ addedAt: -1 });

        // Filter out items where product was deleted
        const validItems = wishlistItems.filter(item => item.productId).map(item => ({
            _id: item._id,
            productId: item.productId._id,
            pname: item.productId.pname,
            brand: item.productId.brand,
            price: item.productId.price,
            image: item.productId.pimage,
            category: item.productId.category,
            subcategory: item.productId.subcategory,
            addedAt: item.addedAt
        }));

        res.status(200).json(validItems);
    } catch (err) {
        console.error('Error fetching wishlist:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Check if product is in user's wishlist
router.get('/check/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const exists = await Wishlist.findOne({ userId, productId });

        res.status(200).json({ isWishlisted: !!exists });
    } catch (err) {
        console.error('Error checking wishlist:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get wishlist count for user
router.get('/count/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const count = await Wishlist.countDocuments({ userId });

        res.status(200).json({ count });
    } catch (err) {
        console.error('Error getting wishlist count:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;

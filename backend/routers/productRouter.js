const express = require('express');
const router = express.Router();
const Model = require('../models/productModel');
const verifyToken = require('./verifyToken');

router.post('/add', verifyToken, (req,res)=>{
    req.body.seller = req.user._id;
    console.log('📝 Adding new product:');
    console.log('   Seller ID:', req.user._id);
    console.log('   Product Name:', req.body.pname);
    console.log('   Category:', req.body.category);
    console.log('   Price:', req.body.pprice);
    console.log('   Images:', req.body.images);
    
    new Model(req.body).save()
    .then((result)=>{
        console.log('✅ Product added successfully! ID:', result._id);
        res.status(200).json(result);
    }).catch((err)=>{
        console.log('❌ Error adding product:', err);
        res.status(500).json(err);
    })
});

router.get('/getbycategory/:category',(req,res)=>{
    console.log(req.params.category);
    Model.find({category : req.params.category})
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err)
    });
});

router.get('/getall',(req,res)=>{
    console.log('📥 GET /product/getall - Fetching all products');
    Model.find({})
        .populate({
            path: 'seller',
            strictPopulate: false // Allow missing seller references
        })
        .lean() // Return plain objects for better performance
        .then((result) => {
            // Filter out products with null seller if needed
            const validProducts = result.filter(p => p.seller !== null);
            console.log(`✅ Returning ${validProducts.length} products (${result.length - validProducts.length} with missing sellers)`);
            if (validProducts.length > 0) {
                console.log('Sample product:', validProducts[0]);
            }
            res.status(200).json(validProducts);
        }).catch((err) => {
            console.log('❌ Error fetching products:', err.message);
            console.error('Full error:', err);
            res.status(500).json({ 
                error: 'Failed to fetch products',
                message: err.message 
            });
        });
});

router.delete('/delete/:id',(req,res)=>{
    Model.findByIdAndDelete(req.params.id)
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err)
    });
});

router.get('/getbyid/:id',(req,res)=>{
    Model.findById(req.params.id)
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err)
    });
});

router.get('/getbyseller', verifyToken, (req, res) => {
    console.log('👤 GET /product/getbyseller - Seller ID:', req.user._id);
    console.log('🔑 Token from header:', req.header('x-auth-token'));
    console.log('🧑‍💻 Decoded user from token:', req.user);
    Model.find({seller : req.user._id})
        .then((result) => {
            console.log(`✅ Found ${result.length} products for seller ${req.user._id}`);
            console.log('📦 Products:', result);
            res.status(200).json(result);
        }).catch((err) => {
            console.log('❌ Error fetching seller products:', err);
            res.status(500).json(err);
        });
});

// Get products by seller ID (without token - for dashboard)
router.get('/getbyseller/:sellerId', (req, res) => {
    Model.find({seller : req.params.sellerId})
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.put('/update/:id', (req,res) => {
    console.log(req.body);
    Model.findByIdAndUpdate(req.params.id, req.body,{new:true})
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
})

module.exports= router;
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
    Model.find({}).populate('seller')
    .then((result) => {
        console.log(`✅ Returning ${result.length} products`);
        if (result.length > 0) {
            console.log('Sample product:', result[0]);
        }
        res.status(200).json(result);
    }).catch((err) => {
        console.log('❌ Error fetching products:', err);
        res.status(500).json(err);
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
    Model.find({seller : req.user._id})
        .then((result) => {
            console.log(`✅ Found ${result.length} products for seller ${req.user._id}`);
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
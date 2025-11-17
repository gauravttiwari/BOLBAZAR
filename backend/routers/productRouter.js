const express = require('express');
const router = express.Router();
const Model = require('../models/productModel');
const verifyToken = require('./verifyToken');

router.post('/add', verifyToken, (req,res)=>{
    req.body.seller = req.user._id;
    console.log(req.body);
    new Model(req.body).save()
    .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
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
    Model.find({}).populate('seller')
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
    console.log(req.body);
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
    Model.find({seller : req.user._id})
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
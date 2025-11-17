const express = require('express');
const router = express.Router();
const Model = require('../models/reviewModel');
const verifyToken = require('./verifyToken');

router.post('/add', verifyToken, (req, res) => {
     req.body.user = req.user._id;
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        })
});

// getbyproduct
router.get('/getbyproduct/:id', (req, res) => {
    Model.find({ product: req.params.id }).populate('user')
        .populate('user')
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        })
});

// getall

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        })
});


module.exports = router;
const express = require('express');
const router = express.Router();
const Model = require('../models/userModel');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.post('/add', async (req, res) => {
    try {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = { ...req.body, password: hashedPassword };
        
        const result = await new Model(userData).save();
        
        // Remove password from response
        const userResponse = result.toObject();
        delete userResponse.password;
        
        res.status(200).json(userResponse);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err)
        });
});

router.get('/getall', (req, res) => {
    Model.find({})
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    console.log(req.body);
});

router.get('/getbyid', verifyToken, (req, res) => {
    Model.findById(req.user._id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    console.log(req.body);
});

router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    // console.log(req.body);
});

router.get('/getbymail/:email', (req, res) => {
    Model.findOne({ email: req.params.email })
        .then((result) => {
            if (result) res.status(200).json(result);
            else res.status(404).json({ message: 'User not found' });
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    console.log(req.body);
});



router.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await Model.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Create JWT token
        const { _id, fname, lname } = user;
        const payload = { _id, fname, lname, email };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '2 days' },
            (err, token) => {
                if (err) {
                    console.error('Token creation error:', err);
                    return res.status(500).json({ message: 'Error creating token' });
                }
                res.status(200).json({ token, fname, lname, email });
            }
        );
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})


module.exports = router;

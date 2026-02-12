const express = require('express');
const router = express.Router();
const Model = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ⛔ DISABLED - Admin signup is not allowed publicly
// Only pre-registered master admin can login
router.post('/add', (req, res) => {
    res.status(403).json({ 
        message: 'Admin registration is disabled for security reasons. Only master admin can access the system.' 
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

router.delete('/delete/:id',(req,res)=>{
    Model.findByIdAndDelete(req.params.id)
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err)
    });
});

// 🔐 Secure Admin Login - Only Master Admin with hashed password
router.post('/authenticate', async (req, res) => {
    console.log('⚡ Admin login attempt:', req.body.email);
    
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if email matches master admin
    if (email !== process.env.MASTER_ADMIN_EMAIL) {
        console.log('❌ Unauthorized email:', email);
        return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    try {
        // Compare password with hashed password from environment
        const isPasswordValid = await bcrypt.compare(password, process.env.MASTER_ADMIN_PASSWORD_HASH);
        
        if (!isPasswordValid) {
            console.log('❌ Invalid password for admin:', email);
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }
        
        // Create JWT payload
        const payload = { 
            _id: 'master_admin', 
            fname: process.env.MASTER_ADMIN_FNAME, 
            lname: process.env.MASTER_ADMIN_LNAME, 
            email: process.env.MASTER_ADMIN_EMAIL,
            role: 'admin'
        };

        // Generate JWT token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '2 days' },
            (err, token) => {
                if (err) {
                    console.log('❌ Token creation error:', err);
                    return res.status(500).json({ message: 'Error creating authentication token' });
                }
                
                console.log('✅ Master admin logged in successfully');
                res.status(200).json({ 
                    token, 
                    fname: payload.fname, 
                    lname: payload.lname, 
                    email: payload.email,
                    role: 'admin',
                    message: 'Login successful'
                });
            }
        );
    } catch (error) {
        console.log('❌ Authentication error:', error);
        res.status(500).json({ message: 'Authentication failed' });
    }
});

module.exports = router;
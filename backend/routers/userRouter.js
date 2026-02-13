const express = require('express');
const router = express.Router();
const Model = require('../models/userModel');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.post('/add', async (req, res) => {
    try {
        // Check if email already exists
        const existingUser = await Model.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        let userData = { ...req.body };
        
        // Hash password if provided
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            userData.password = hashedPassword;
        }
        
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

        // Check if user has a password set
        if (!user.password) {
            return res.status(401).json({ 
                message: 'This account uses passwordless login. Please sign up again with a password or use passwordless login.',
                noPassword: true 
            });
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
                res.status(200).json({ _id, token, fname, lname, email });
            }
        );
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

// Address Management Routes

// Add new address
router.post('/address/add/:userId', async (req, res) => {
    try {
        const user = await Model.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If this is the first address or marked as default, set it as default
        if (user.addresses.length === 0 || req.body.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
            req.body.isDefault = true;
        }

        user.addresses.push(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Error adding address:', err);
        res.status(500).json({ message: 'Error adding address', error: err.message });
    }
});

// Get all addresses for a user
router.get('/address/getall/:userId', async (req, res) => {
    try {
        const user = await Model.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.addresses || []);
    } catch (err) {
        console.error('Error fetching addresses:', err);
        res.status(500).json({ message: 'Error fetching addresses', error: err.message });
    }
});

// Update address
router.put('/address/update/:userId/:addressId', async (req, res) => {
    try {
        const user = await Model.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(req.params.addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // If marking as default, unset other defaults
        if (req.body.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Error updating address:', err);
        res.status(500).json({ message: 'Error updating address', error: err.message });
    }
});

// Delete address
router.delete('/address/delete/:userId/:addressId', async (req, res) => {
    try {
        const user = await Model.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.addresses.pull(req.params.addressId);
        
        // If deleted address was default and there are more addresses, set first as default
        if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
            user.addresses[0].isDefault = true;
        }
        
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Error deleting address:', err);
        res.status(500).json({ message: 'Error deleting address', error: err.message });
    }
});

// Set default address
router.put('/address/setdefault/:userId/:addressId', async (req, res) => {
    try {
        const user = await Model.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Unset all defaults
        user.addresses.forEach(addr => addr.isDefault = false);
        
        // Set new default
        const address = user.addresses.id(req.params.addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        address.isDefault = true;
        
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Error setting default address:', err);
        res.status(500).json({ message: 'Error setting default address', error: err.message });
    }
});

// Verify pincode for delivery (Mock implementation)
router.get('/verify-pincode/:pincode', async (req, res) => {
    try {
        const pincode = req.params.pincode;
        
        // Mock pincode verification - In production, integrate with courier API
        if (pincode.length === 6 && /^\d+$/.test(pincode)) {
            // Simulate delivery availability based on pincode
            const isDeliverable = parseInt(pincode[0]) <= 7; // Mock logic
            
            res.status(200).json({
                deliverable: isDeliverable,
                estimatedDays: isDeliverable ? Math.floor(Math.random() * 5) + 3 : null,
                message: isDeliverable ? 'Delivery available' : 'Delivery not available in this area'
            });
        } else {
            res.status(400).json({ message: 'Invalid pincode format' });
        }
    } catch (err) {
        console.error('Error verifying pincode:', err);
        res.status(500).json({ message: 'Error verifying pincode', error: err.message });
    }
});


module.exports = router;


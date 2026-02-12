const express = require('express');
const router = express.Router();
const Model = require('../models/sellerModel');
const jwt = require('jsonwebtoken');
const { generateChallenge, verifySignature } = require('../utils/crypto');
require('dotenv').config();

router.post('/add', (req, res) => {
    console.log(req.body);
    new Model(req.body).save()
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
});

// Passwordless Signup
router.post('/passwordless/signup', async (req, res) => {
    try {
        const { email, fname, lname, businessName, publicKey, deviceInfo } = req.body;

        // Check if seller already exists
        const existingSeller = await Model.findOne({ email });
        
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists with this email' });
        }

        // Create new seller with public key
        const newSeller = new Model({
            email,
            fname,
            lname,
            businessName,
            publicKeys: [{
                key: publicKey,
                deviceInfo,
                createdAt: new Date(),
                lastUsed: new Date()
            }]
        });

        const result = await newSeller.save();
        
        // Generate JWT token
        const payload = { _id: result._id, fname, lname, email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7 days' });

        res.status(200).json({
            message: 'Seller registered successfully',
            token,
            seller: { _id: result._id, fname, lname, email, businessName }
        });
    } catch (error) {
        console.error('Seller signup error:', error);
        res.status(500).json({ message: 'Error creating seller account', error: error.message });
    }
});

// Passwordless Login - Request Challenge
router.post('/passwordless/challenge', async (req, res) => {
    try {
        const { email } = req.body;
        
        const seller = await Model.findOne({ email });
        
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!seller.publicKeys || seller.publicKeys.length === 0) {
            return res.status(400).json({ message: 'No devices registered. Please sign up again.' });
        }

        const challenge = generateChallenge();
        
        // Store challenge temporarily (in production, use Redis)
        global.challenges = global.challenges || {};
        global.challenges[email] = { challenge, timestamp: Date.now() };

        res.status(200).json({ challenge });
    } catch (error) {
        console.error('Challenge request error:', error);
        res.status(500).json({ message: 'Error generating challenge', error: error.message });
    }
});

// Passwordless Login - Verify Challenge
router.post('/passwordless/verify', async (req, res) => {
    try {
        const { email, signature, deviceInfo } = req.body;
        console.log('🔐 Verify Challenge Request:', { email, hasSignature: !!signature });

        const seller = await Model.findOne({ email });
        
        if (!seller) {
            console.log('❌ Seller not found:', email);
            return res.status(404).json({ message: 'Seller not found' });
        }

        console.log('✅ Seller found:', seller.email);
        console.log('📱 Seller has', seller.publicKeys?.length || 0, 'registered devices');

        const storedChallenge = global.challenges?.[email];
        
        if (!storedChallenge) {
            console.log('❌ No challenge found for:', email);
            return res.status(400).json({ message: 'No challenge found. Please request a new one.' });
        }

        console.log('✅ Challenge found');

        // Challenge expires after 5 minutes
        if (Date.now() - storedChallenge.timestamp > 5 * 60 * 1000) {
            delete global.challenges[email];
            console.log('❌ Challenge expired');
            return res.status(400).json({ message: 'Challenge expired. Please request a new one.' });
        }

        // Find matching public key
        let matchedKeyIndex = -1;
        let verified = false;

        for (let i = 0; i < seller.publicKeys.length; i++) {
            const publicKey = seller.publicKeys[i].key;
            console.log(`🔑 Trying key ${i + 1}/${seller.publicKeys.length}...`);
            
            if (verifySignature(publicKey, storedChallenge.challenge, signature)) {
                matchedKeyIndex = i;
                verified = true;
                console.log(`✅ Signature verified with key ${i + 1}`);
                break;
            } else {
                console.log(`❌ Key ${i + 1} failed verification`);
            }
        }

        if (!verified) {
            console.log('❌ All keys failed - Invalid signature');
            return res.status(401).json({ message: 'Invalid signature' });
        }

        // Update last used timestamp
        seller.publicKeys[matchedKeyIndex].lastUsed = new Date();
        await seller.save();

        // Clear challenge
        delete global.challenges[email];

        // Generate JWT token
        const payload = { 
            _id: seller._id, 
            fname: seller.fname, 
            lname: seller.lname, 
            email: seller.email 
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7 days' });

        console.log('✅ Login successful for:', email);
        res.status(200).json({
            message: 'Login successful',
            token,
            seller: { 
                _id: seller._id, 
                fname: seller.fname, 
                lname: seller.lname, 
                email: seller.email,
                businessName: seller.businessName
            }
        });
    } catch (error) {
        console.error('Challenge verification error:', error);
        res.status(500).json({ message: 'Error verifying challenge', error: error.message });
    }
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

// Get seller by ID
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'Seller not found' });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Update seller profile
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'Seller not found' });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/authenticate', (req, res) => {
    console.log(req.body);
    Model.findOne(req.body)
        .then((result) => {
            if (result) {
                console.log(result);
                const { _id, fname, lname, email, avatar } = result
                const payload = { _id, fname, lname, email };

                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '2 days' },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ message: 'error creating token' })
                        } else {
                            res.status(200).json({ token, fname, lname, avatar })
                        }
                    }
                )
            }
            else res.status(401).json({ message: 'Login Failed' })
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
})

module.exports = router;
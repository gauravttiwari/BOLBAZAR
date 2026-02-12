const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { generateChallenge, verifySignature } = require('../utils/crypto');
const { generateToken } = require('../utils/jwt');

// Temporary storage for challenges (in production, use Redis)
const challenges = new Map();

// Signup with public key (passwordless)
router.post('/signup', async (req, res) => {
  try {
    const { fname, lname, email, publicKey, deviceInfo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with public key
    const newUser = new User({
      fname,
      lname,
      email,
      publicKeys: [{
        key: publicKey,
        deviceInfo: deviceInfo || 'Unknown Device',
        createdAt: new Date(),
        lastUsed: new Date()
      }]
    });

    await newUser.save();

    // Generate token
    const token = generateToken({ _id: newUser._id, email: newUser.email });

    res.status(200).json({
      message: 'Signup successful',
      token,
      user: {
        _id: newUser._id,
        fname: newUser.fname,
        lname: newUser.lname,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Passwordless signup error:', error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// Request challenge for login
router.post('/request-challenge', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.publicKeys || user.publicKeys.length === 0) {
      return res.status(404).json({ message: 'User not found or no devices registered' });
    }

    // Generate challenge
    const challenge = generateChallenge();
    challenges.set(email, { challenge, timestamp: Date.now() });

    // Auto-delete challenge after 5 minutes
    setTimeout(() => challenges.delete(email), 5 * 60 * 1000);

    res.status(200).json({ challenge });
  } catch (error) {
    console.error('Challenge request error:', error);
    res.status(500).json({ message: 'Failed to generate challenge' });
  }
});

// Verify challenge and login
router.post('/verify-challenge', async (req, res) => {
  try {
    const { email, signature } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const challengeData = challenges.get(email);
    if (!challengeData) {
      return res.status(400).json({ message: 'No challenge found. Please request a new challenge.' });
    }

    const { challenge } = challengeData;

    // Verify signature with any of the user's public keys
    let verified = false;
    let matchedKeyIndex = -1;

    for (let i = 0; i < user.publicKeys.length; i++) {
      if (verifySignature(user.publicKeys[i].key, challenge, signature)) {
        verified = true;
        matchedKeyIndex = i;
        break;
      }
    }

    if (!verified) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Update last used timestamp
    user.publicKeys[matchedKeyIndex].lastUsed = new Date();
    await user.save();

    // Clear challenge
    challenges.delete(email);

    // Generate token
    const token = generateToken({ _id: user._id, email: user.email });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Challenge verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// Get user's registered devices
router.get('/devices/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const devices = user.publicKeys.map((key, index) => ({
      index,
      deviceInfo: key.deviceInfo,
      createdAt: key.createdAt,
      lastUsed: key.lastUsed
    }));

    res.status(200).json({ devices });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch devices' });
  }
});

// Remove a device
router.delete('/devices/:email/:index', async (req, res) => {
  try {
    const { email, index } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (index < 0 || index >= user.publicKeys.length) {
      return res.status(400).json({ message: 'Invalid device index' });
    }

    user.publicKeys.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Device removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove device' });
  }
});

module.exports = router;

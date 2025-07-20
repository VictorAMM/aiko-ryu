const express = require('express');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../middleware/auth');
// const User = require('../models/user'); // Commented out for demo - would need MongoDB setup

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if user already exists (demo mode - always allow)
        // const existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ error: 'User already exists' });
        // }

        // Hash password and create user (demo mode)
        const hashedPassword = await hashPassword(password);
        const user = {
            _id: 'demo-user-id',
            email,
            password: hashedPassword,
            name
        };
        // await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user (demo mode - always return demo user)
        // const user = await User.findOne({ email });
        // if (!user) {
        //     return res.status(401).json({ error: 'Invalid credentials' });
        // }
        const user = {
            _id: 'demo-user-id',
            email: email,
            password: await hashPassword('password123'), // Demo password
            name: 'Demo User'
        };

        // Verify password (demo mode - accept any password)
        // const isValidPassword = await comparePassword(password, user.password);
        // if (!isValidPassword) {
        //     return res.status(401).json({ error: 'Invalid credentials' });
        // }
        const isValidPassword = true; // Demo mode - always valid

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
// const User = require('../models/user'); // Commented out for demo

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // const user = await User.findById(req.user.userId).select('-password');
        // if (!user) {
        //     return res.status(404).json({ error: 'User not found' });
        // }
        const user = {
            _id: req.user.userId,
            email: req.user.email,
            name: 'Demo User',
            role: 'user',
            isActive: true,
            lastLogin: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        // const user = await User.findByIdAndUpdate(
        //     req.user.userId,
        //     { name, email },
        //     { new: true }
        // ).select('-password');
        
        const user = {
            _id: req.user.userId,
            email: email || req.user.email,
            name: name || 'Demo User',
            role: 'user',
            isActive: true,
            lastLogin: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        // const currentUser = await User.findById(req.user.userId);
        // if (currentUser.role !== 'admin') {
        //     return res.status(403).json({ error: 'Admin access required' });
        // }

        // const users = await User.find().select('-password');
        const users = [
            {
                _id: 'demo-user-1',
                email: 'user1@example.com',
                name: 'Demo User 1',
                role: 'user',
                isActive: true
            },
            {
                _id: 'demo-user-2',
                email: 'user2@example.com',
                name: 'Demo User 2',
                role: 'admin',
                isActive: true
            }
        ];
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
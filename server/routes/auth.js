const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 'postmessage');

function signToken(user) {
    const data = { user: { id: user.id } };
    return jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
}

// Route 1: Register User
router.post(
    '/register',
    [
        body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        try {
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                return res.status(400).json({
                    success: false,
                    error: 'User with this email already exists',
                });
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });

            res.json({ success: true, authToken: signToken(user) });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// Route 2: Login User
router.post(
    '/login',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user || !user.password) {
            
                return res.status(400).json({
                    success: false,
                    error: 'Invalid credentials',
                });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);

            if (!passwordCompare) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid credentials',
                });
            }

            res.json({ success: true, authToken: signToken(user) });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// Route 3: Sign in / sign up with Google
router.post('/google', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, error: 'Missing Google authorization code' });
    }

    try {
      
        const { tokens } = await googleClient.getToken(code);

        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                googleId,
            });
        } else if (!user.googleId) {
           
            user.googleId = googleId;
            await user.save();
        }

        res.json({ success: true, authToken: signToken(user) });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ success: false, error: 'Google sign-in failed' });
    }
});

// Route 4: Get Logged In User
router.get('/me', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');

        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

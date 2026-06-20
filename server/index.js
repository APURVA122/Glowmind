require('dotenv').config();

const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: [
            'http://localhost:5173', // Vite dev server
            process.env.CLIENT_URL, // your deployed frontend, once you have one
        ].filter(Boolean),
        credentials: true,
    })
);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'GlowMind AI auth API running successfully' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

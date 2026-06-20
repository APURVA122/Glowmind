const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URI;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connected to MongoDB Atlas successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectToMongo;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

   
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
    },

   
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);

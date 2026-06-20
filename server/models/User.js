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

    // Not required for accounts created via Google sign-in — they have
    // no password set at all (see routes/auth.js -> "/google").
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
    },

    // Present only for accounts linked to (or created via) Google.
    // `sparse: true` lets many documents have no googleId without
    // violating the unique index (sparse indexes ignore null/missing).
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

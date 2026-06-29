const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * One "notebook" entry per (user, domain) pair.
 * Lives as its own document so a site shows up in the dropdown
 * the moment it's added, even before its first note is written.
 */
const DomainSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    domain: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// One notebook per user/domain pair — prevents duplicates.
DomainSchema.index({ userId: 1, domain: 1 }, { unique: true });

module.exports = mongoose.model('Domain', DomainSchema);

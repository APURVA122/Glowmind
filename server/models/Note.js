const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
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
    text: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: '📝',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Every query is "give me this user's notes for this domain" — index
// makes that fast as the collection grows.
NoteSchema.index({ userId: 1, domain: 1 });

module.exports = mongoose.model('Note', NoteSchema);

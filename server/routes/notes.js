const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Domain = require('../models/Domain');
const Note = require('../models/Note');

// Every route below requires a signed-in user.
// fetchuser verifies the JWT and attaches req.user.id.
router.use(fetchuser);

// ─── helpers ────────────────────────────────────────────────────────────────

function serializeNote(note) {
    return {
        id: note._id.toString(),
        text: note.text,
        tag: note.tag,
        createdAt: note.createdAt.getTime(),
    };
}

async function getDomainsForUser(userId) {
    const docs = await Domain.find({ userId }).sort({ createdAt: 1 });
    return docs.map((d) => d.domain);
}

async function getNotesForUserDomain(userId, domain) {
    const docs = await Note.find({ userId, domain }).sort({ createdAt: 1 });
    return docs.map(serializeNote);
}

async function ensureDomainExists(userId, domain) {
    await Domain.updateOne(
        { userId, domain },
        { $setOnInsert: { userId, domain } },
        { upsert: true }
    );
}

// ─── domain routes ────────────────────────────────────────────────────────────
// These MUST be registered before /:domain so "domains" is never treated
// as someone's literal domain name.

// GET  /api/notes/domains  — list all notebooks for this user
router.get('/domains', async (req, res) => {
    try {
        res.json({ success: true, domains: await getDomainsForUser(req.user.id) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Could not load your sites' });
    }
});

// POST /api/notes/domains  — register a site before its first note
router.post('/domains', async (req, res) => {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ success: false, error: 'domain is required' });
    try {
        await ensureDomainExists(req.user.id, domain);
        res.json({ success: true, domains: await getDomainsForUser(req.user.id) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Could not add that site' });
    }
});

// DELETE /api/notes/domains/:domain  — remove a notebook + all its notes
router.delete('/domains/:domain', async (req, res) => {
    try {
        await Promise.all([
            Domain.deleteOne({ userId: req.user.id, domain: req.params.domain }),
            Note.deleteMany({ userId: req.user.id, domain: req.params.domain }),
        ]);
        res.json({ success: true, domains: await getDomainsForUser(req.user.id) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Could not remove that site' });
    }
});

// ─── note routes ──────────────────────────────────────────────────────────────

// GET  /api/notes/:domain          — list notes for a domain
router.get('/:domain', async (req, res) => {
    try {
        res.json({ success: true, notes: await getNotesForUserDomain(req.user.id, req.params.domain) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Could not load your notes' });
    }
});

// POST /api/notes/:domain          — add a note
router.post('/:domain', async (req, res) => {
    const { text, tag } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, error: 'text is required' });
    try {
        await ensureDomainExists(req.user.id, req.params.domain);
        await Note.create({ userId: req.user.id, domain: req.params.domain, text: text.trim(), tag: tag || '📝' });
        res.json({ success: true, notes: await getNotesForUserDomain(req.user.id, req.params.domain) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Could not save that note' });
    }
});

// PUT  /api/notes/:domain/:noteId  — edit a note's text
router.put('/:domain/:noteId', async (req, res) => {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, error: 'text is required' });
    try {
        const note = await Note.findOne({ _id: req.params.noteId, userId: req.user.id });
        if (!note) return res.status(404).json({ success: false, error: 'Note not found' });
        note.text = text.trim();
        await note.save();
        res.json({ success: true, notes: await getNotesForUserDomain(req.user.id, req.params.domain) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Could not update that note' });
    }
});

// DELETE /api/notes/:domain/:noteId — delete a note
router.delete('/:domain/:noteId', async (req, res) => {
    try {
        await Note.deleteOne({ _id: req.params.noteId, userId: req.user.id });
        res.json({ success: true, notes: await getNotesForUserDomain(req.user.id, req.params.domain) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Could not delete that note' });
    }
});

module.exports = router;

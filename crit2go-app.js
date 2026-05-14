/**
 * CRIT 2 GO — Node.js/Express App Server
 * Run: node crit2go-app.js
 * Then open: http://localhost:3000
 *
 * Dependencies: npm install express multer cors
 */

'use strict';

const express  = require('express');
const multer   = require('multer');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
const https    = require('https');
const http     = require('http');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML frontend
app.use(express.static(path.join(__dirname)));

// ─────────────────────────────────────────
// FILE UPLOADS (multer)
// ─────────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(fig|png|jpg|jpeg|pdf|sketch|xd|zip|svg)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error('Unsupported file type'), false);
  },
});

// ─────────────────────────────────────────
// IN-MEMORY DATA STORE
// (swap with a real DB — e.g. SQLite, Postgres — for production)
// ─────────────────────────────────────────
const db = {
  critiques: [
    {
      id: 1, title: 'Checkout Redesign v2', step: 4,
      deadline: '2026-05-14T17:00', status: 'Awaiting Feedback',
      files: [], stakeholders: [
        { name: 'Jordan Lee', email: 'jordan@co.com', role: 'Engineer' },
        { name: 'Sam Rivera', email: 'sam@co.com', role: 'Product Manager' },
      ],
      prompt: 'Evaluate CTA placement and mobile checkout clarity.',
      description: 'Post user-testing iteration. Prior research showed 40% drop-off at payment step.',
      feedbackList: [], votes: { yes: 1, no: 1 }, approvalNotes: '',
    },
    {
      id: 2, title: 'Onboarding Flow Update', step: 6,
      deadline: '2026-05-13T12:00', status: 'Pending Approval',
      files: [], stakeholders: [
        { name: 'Taylor Kim', email: 'taylor@co.com', role: 'Product Owner' },
      ],
      prompt: 'Is the 3-step onboarding clear for new users?',
      description: 'Redesigned to reduce time-to-value from 8 min to under 3 min.',
      feedbackList: [
        { author: 'Sam Rivera', type: 'text', content: 'Step 2 needs clearer progress indicator.', time: '10:22 AM' },
      ],
      votes: { yes: 0, no: 2 }, approvalNotes: '',
    },
    {
      id: 3, title: 'Dashboard Navigation', step: 2,
      deadline: '2026-05-16T09:00', status: 'In Progress',
      files: [], stakeholders: [],
      prompt: '', description: '', feedbackList: [], votes: { yes: 0, no: 0 }, approvalNotes: '',
    },
  ],
  nextId: 4,
  slackWebhook: process.env.SLACK_WEBHOOK || '',
  slackChannel: process.env.SLACK_CHANNEL || 'design-critique',
};

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function findCritique(id) {
  return db.critiques.find(c => c.id === Number(id));
}

function slackMessage(text) {
  if (!db.slackWebhook) return Promise.resolve();
  const payload = JSON.stringify({ text, channel: `#${db.slackChannel}` });
  return new Promise((resolve) => {
    try {
      const url = new URL(db.slackWebhook);
      const lib  = url.protocol === 'https:' ? https : http;
      const req  = lib.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } }, resolve);
      req.on('error', () => resolve());
      req.write(payload);
      req.end();
    } catch { resolve(); }
  });
}

const STEP_LABELS = ['Upload', 'Context', 'Tag Stakeholders', 'Feedback', 'Vote', 'Approval', 'Dev Ready'];

// ─────────────────────────────────────────
// ROUTES — Critiques
// ─────────────────────────────────────────

// GET  /api/critiques          — list all
app.get('/api/critiques', (req, res) => {
  res.json({ ok: true, data: db.critiques });
});

// GET  /api/critiques/:id      — single
app.get('/api/critiques/:id', (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, data: c });
});

// POST /api/critiques          — create
app.post('/api/critiques', (req, res) => {
  const { title, deadline, prompt, description, version } = req.body;
  if (!title || !deadline) return res.status(400).json({ ok: false, error: 'title and deadline are required' });
  const critique = {
    id: db.nextId++, title, deadline, prompt: prompt || '', description: description || '',
    version: version || '', step: 1, status: 'In Progress',
    files: [], stakeholders: [], feedbackList: [], votes: { yes: 0, no: 0 }, approvalNotes: '',
  };
  db.critiques.push(critique);
  slackMessage(`📋 New design critique started: *${title}* — Deadline: ${deadline}`);
  res.status(201).json({ ok: true, data: critique });
});

// PATCH /api/critiques/:id     — update fields / advance step
app.patch('/api/critiques/:id', (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  const allowed = ['title','deadline','prompt','description','version','step','status','approvalNotes'];
  allowed.forEach(k => { if (req.body[k] !== undefined) c[k] = req.body[k]; });
  if (req.body.step) {
    slackMessage(`📋 *${c.title}* advanced to Step ${c.step}: ${STEP_LABELS[c.step - 1]}`);
  }
  res.json({ ok: true, data: c });
});

// DELETE /api/critiques/:id
app.delete('/api/critiques/:id', (req, res) => {
  const idx = db.critiques.findIndex(c => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ ok: false, error: 'Not found' });
  db.critiques.splice(idx, 1);
  res.json({ ok: true });
});

// ─────────────────────────────────────────
// ROUTES — File Upload
// ─────────────────────────────────────────
app.post('/api/critiques/:id/files', upload.array('files', 20), (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  const saved = req.files.map(f => ({ name: f.originalname, size: f.size, path: f.filename, mime: f.mimetype }));
  c.files.push(...saved);
  res.json({ ok: true, data: saved });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// ─────────────────────────────────────────
// ROUTES — Stakeholders
// ─────────────────────────────────────────
app.post('/api/critiques/:id/stakeholders', (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  const { name, email, role } = req.body;
  if (!name || !email || !role) return res.status(400).json({ ok: false, error: 'name, email, role required' });
  const stakeholder = { name, email, role };
  c.stakeholders.push(stakeholder);
  slackMessage(`👤 *${name}* (${role}) has been tagged as a reviewer on *${c.title}*`);
  res.status(201).json({ ok: true, data: stakeholder });
});

app.delete('/api/critiques/:id/stakeholders/:idx', (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  c.stakeholders.splice(Number(req.params.idx), 1);
  res.json({ ok: true });
});

// ─────────────────────────────────────────
// ROUTES — Feedback
// ─────────────────────────────────────────
app.post('/api/critiques/:id/feedback', (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  const { author, type, content, duration } = req.body;
  if (!author || !type) return res.status(400).json({ ok: false, error: 'author and type required' });
  const entry = { author, type, content: content || '', duration: duration || '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
  c.feedbackList.push(entry);
  slackMessage(`💬 *${author}* submitted ${type === 'voice' ? 'a voice note' : 'written feedback'} on *${c.title}*`);
  res.status(201).json({ ok: true, data: entry });
});

// Voice note upload
app.post('/api/critiques/:id/feedback/voice', upload.single('audio'), (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  const { author, duration } = req.body;
  const entry = { author: author || 'Anonymous', type: 'voice', content: '', duration: duration || '0:00', audioFile: req.file?.filename || '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
  c.feedbackList.push(entry);
  slackMessage(`🎙️ *${author}* submitted a voice recording on *${c.title}*`);
  res.status(201).json({ ok: true, data: entry });
});

// ─────────────────────────────────────────
// ROUTES — Voting
// ─────────────────────────────────────────
app.post('/api/critiques/:id/vote', (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  const { vote } = req.body; // 'yes' | 'no'
  if (!['yes','no'].includes(vote)) return res.status(400).json({ ok: false, error: "vote must be 'yes' or 'no'" });
  c.votes[vote]++;
  const total = c.votes.yes + c.votes.no;
  slackMessage(`🗳️ New vote on *${c.title}* — Iterate: ${c.votes.yes} | Approve: ${c.votes.no} (${total} total)`);
  res.json({ ok: true, data: c.votes });
});

// ─────────────────────────────────────────
// ROUTES — Approval
// ─────────────────────────────────────────
app.post('/api/critiques/:id/approve', (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  c.approvalNotes = req.body.notes || '';
  c.step   = 7;
  c.status = 'Dev Ready';
  c.approvedAt = new Date().toISOString();
  slackMessage(`🚀 *${c.title}* has been approved by the Product Owner and is *READY FOR DEVELOPMENT*! Time to build 🎉`);
  res.json({ ok: true, data: c });
});

app.post('/api/critiques/:id/request-changes', (req, res) => {
  const c = findCritique(req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  c.step   = 2;
  c.status = 'Changes Requested';
  slackMessage(`🔄 *${c.title}* — Product Owner requested design changes. Returning to Step 2.`);
  res.json({ ok: true, data: c });
});

// ─────────────────────────────────────────
// ROUTES — Slack Integration
// ─────────────────────────────────────────
app.post('/api/slack/configure', (req, res) => {
  const { webhookUrl, channel } = req.body;
  if (!webhookUrl) return res.status(400).json({ ok: false, error: 'webhookUrl required' });
  db.slackWebhook = webhookUrl;
  db.slackChannel = channel || 'design-critique';
  res.json({ ok: true, message: 'Slack configured' });
});

app.post('/api/slack/test', async (req, res) => {
  if (!db.slackWebhook) return res.status(400).json({ ok: false, error: 'No webhook configured' });
  await slackMessage('👋 CRIT 2 GO test notification — your Slack integration is working!');
  res.json({ ok: true, message: 'Test notification sent' });
});

// ─────────────────────────────────────────
// CATCH-ALL — serve frontend
// ─────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'crit2go.html'));
});

// ─────────────────────────────────────────
// ERROR HANDLER
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ ok: false, error: 'File too large (max 50 MB)' });
  console.error(err.message);
  res.status(500).json({ ok: false, error: err.message || 'Server error' });
});

// ─────────────────────────────────────────
// START
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ CRIT 2 GO running at http://localhost:${PORT}`);
  console.log(`   Slack webhook: ${db.slackWebhook ? 'configured' : 'not set (use /api/slack/configure)'}`);
  console.log(`   Uploads dir:   ${uploadDir}\n`);
  console.log('API Endpoints:');
  console.log('  GET    /api/critiques');
  console.log('  POST   /api/critiques');
  console.log('  GET    /api/critiques/:id');
  console.log('  PATCH  /api/critiques/:id');
  console.log('  DELETE /api/critiques/:id');
  console.log('  POST   /api/critiques/:id/files');
  console.log('  POST   /api/critiques/:id/stakeholders');
  console.log('  POST   /api/critiques/:id/feedback');
  console.log('  POST   /api/critiques/:id/feedback/voice');
  console.log('  POST   /api/critiques/:id/vote');
  console.log('  POST   /api/critiques/:id/approve');
  console.log('  POST   /api/critiques/:id/request-changes');
  console.log('  POST   /api/slack/configure');
  console.log('  POST   /api/slack/test\n');
});

module.exports = app;

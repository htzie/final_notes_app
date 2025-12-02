// =========================
//  index.js - Notes API
//  Auth + Notes + Debug
// =========================

require('dotenv').config({ path: './.env.local' });

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();

// -------------------------
//  Middleware
// -------------------------
app.use(cors());
app.use(express.json());

console.log("🚀 API starting...");
console.log("🌐 Database Host:", process.env.DB_HOST);
console.log("🗄  Database Name:", process.env.DB_NAME);

// -------------------------
//  Health Check
// -------------------------
app.get('/health', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: r[0].ok === 1 });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// -------------------------
//  Debug Endpoints
//  (Safe for Jenkins testing)
// -------------------------

// 🔍 List ALL users (email only, no password hash)
app.get('/users', async (req, res) => {
  console.log("Debug: Fetching all users...");
  try {
    const [rows] = await pool.query(
      'SELECT id, email, created_at FROM users ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔍 List ALL notes for ALL users
app.get('/all-notes', async (req, res) => {
  console.log("Debug: Fetching all notes...");
  try {
    const [rows] = await pool.query(
      'SELECT id, user_id, title, content, created_at FROM notes ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
//  Main Routes
// -------------------------
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

// -------------------------
//  Root Endpoint
// -------------------------
app.get('/', (req, res) => {
  res.send("Notes API is running successfully.");
});

// -------------------------
//  Start Server
// -------------------------
const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, () => {
  console.log(`🚀 Notes API running at http://localhost:${PORT}`);
});

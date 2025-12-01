const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'email and password required' });

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ error: 'email already registered' });

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hash]
    );

    res.status(201).json({ id: result.insertId, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'email and password required' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(400).json({ error: 'invalid email or password' });

    const user = rows[0];
    const correct = await bcrypt.compare(password, user.password_hash);

    if (!correct)
      return res.status(400).json({ error: 'invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

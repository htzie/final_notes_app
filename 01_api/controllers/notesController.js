const pool = require('../db');

// GET ALL notes by user
exports.getNotes = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM notes WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createNote = async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;

  if (!title)
    return res.status(400).json({ error: 'title required' });

  try {
    const [result] = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content || '']
    );

    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM notes WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const { title, content } = req.body;

  if (!title)
    return res.status(400).json({ error: 'title required' });

  try {
    await pool.query(
      'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [title, content || '', noteId, userId]
    );

    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM notes WHERE id = ? AND user_id = ?',
      [noteId, userId]
    );

    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  try {
    await pool.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [
      noteId,
      userId,
    ]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

require('dotenv').config({ path: './.env.local' });

const express = require('express');
const cors = require('cors');
const app = express();

const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/notes', require('./routes/notes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);

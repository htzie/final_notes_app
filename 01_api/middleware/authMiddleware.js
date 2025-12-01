const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: 'Missing authorization header' });

  const token = authHeader.split(' ')[1];

  if (!token)
    return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
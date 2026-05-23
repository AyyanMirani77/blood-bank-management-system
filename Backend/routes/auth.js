const express = require('express');
const router  = express.Router();
const db      = require('../db');
const jwt     = require('jsonwebtoken');

const SECRET = 'bloodbank_secret_key_2024';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  db.query(
    'SELECT * FROM ADMINISTRATOR WHERE email = ?',
    [email],
    (err, results) => {
      if (err)              return res.status(500).json({ error: err.message });
      if (!results.length)  return res.status(401).json({ error: 'Invalid email or password' });

      const admin = results[0];

      // Simple plain-text password check (good enough for a college project)
      if (password !== admin.password)
        return res.status(401).json({ error: 'Invalid email or password' });

      const token = jwt.sign(
        { admin_id: admin.admin_id, name: admin.name },
        SECRET,
        { expiresIn: '8h' }
      );

      res.json({ token, name: admin.name, admin_id: admin.admin_id });
    }
  );
});

module.exports = router;
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all expiry logs
router.get('/', (req, res) => {
  const sql = `
    SELECT e.*, s.blood_group, a.name AS admin_name
    FROM EXPIRY_LOG e
    JOIN BLOOD_STOCK    s ON e.stock_id = s.stock_id
    JOIN ADMINISTRATOR  a ON e.admin_id = a.admin_id
    ORDER BY e.log_id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single log
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM EXPIRY_LOG WHERE log_id = ?', [req.params.id], (err, results) => {
    if (err)             return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Log not found' });
    res.json(results[0]);
  });
});

// POST add expiry log
router.post('/', (req, res) => {
  const { stock_id, admin_id, expiry_date, units_expired, action_taken } = req.body;

  db.query(
    `INSERT INTO EXPIRY_LOG (stock_id, admin_id, expiry_date, units_expired, action_taken)
     VALUES (?, ?, ?, ?, ?)`,
    [stock_id, admin_id, expiry_date, units_expired, action_taken],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Decrease units from stock
      db.query(
        'UPDATE BLOOD_STOCK SET units_available = units_available - ? WHERE stock_id = ?',
        [units_expired, stock_id]
      );

      res.json({ message: 'Expiry log added!', log_id: result.insertId });
    }
  );
});

// DELETE log
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM EXPIRY_LOG WHERE log_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Log deleted!' });
  });
});

module.exports = router;
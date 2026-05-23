const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all distributions (with joined names)
router.get('/', (req, res) => {
  const sql = `
    SELECT dist.*, r.blood_group, h.name AS hospital_name, a.name AS admin_name
    FROM DISTRIBUTION dist
    JOIN BLOOD_REQUEST  r ON dist.request_id = r.request_id
    JOIN HOSPITAL       h ON r.hospital_id   = h.hospital_id
    JOIN ADMINISTRATOR  a ON dist.admin_id   = a.admin_id
    ORDER BY dist.distribution_id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single distribution
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM DISTRIBUTION WHERE distribution_id = ?', [req.params.id], (err, results) => {
    if (err)             return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Distribution not found' });
    res.json(results[0]);
  });
});

// POST add distribution
router.post('/', (req, res) => {
  const { request_id, stock_id, admin_id, distribution_date, units_distributed, notes } = req.body;

  db.query(
    `INSERT INTO DISTRIBUTION (request_id, stock_id, admin_id, distribution_date, units_distributed, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [request_id, stock_id, admin_id, distribution_date, units_distributed, notes],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Decrease blood stock units
      db.query(
        'UPDATE BLOOD_STOCK SET units_available = units_available - ? WHERE stock_id = ?',
        [units_distributed, stock_id]
      );

      // Update request status to Fulfilled
      db.query(
        "UPDATE BLOOD_REQUEST SET status = 'Fulfilled' WHERE request_id = ?",
        [request_id]
      );

      res.json({ message: 'Distribution recorded!', distribution_id: result.insertId });
    }
  );
});

// DELETE distribution
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM DISTRIBUTION WHERE distribution_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Distribution deleted!' });
  });
});

module.exports = router;
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all blood requests (with hospital name joined)
router.get('/', (req, res) => {
  const sql = `
    SELECT r.*, h.name AS hospital_name, a.name AS admin_name
    FROM BLOOD_REQUEST r
    JOIN HOSPITAL      h ON r.hospital_id = h.hospital_id
    JOIN ADMINISTRATOR a ON r.admin_id    = a.admin_id
    ORDER BY r.request_id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single request
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM BLOOD_REQUEST WHERE request_id = ?', [req.params.id], (err, results) => {
    if (err)             return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Request not found' });
    res.json(results[0]);
  });
});

// POST add blood request
router.post('/', (req, res) => {
  const { hospital_id, admin_id, blood_group, units_requested, request_date, priority, status } = req.body;

  db.query(
    `INSERT INTO BLOOD_REQUEST (hospital_id, admin_id, blood_group, units_requested, request_date, priority, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [hospital_id, admin_id, blood_group, units_requested, request_date, priority || 'Normal', status || 'Pending'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Blood request added!', request_id: result.insertId });
    }
  );
});

// PUT update request status
router.put('/:id', (req, res) => {
  const { hospital_id, admin_id, blood_group, units_requested, request_date, priority, status } = req.body;

  db.query(
    `UPDATE BLOOD_REQUEST SET hospital_id=?, admin_id=?, blood_group=?, units_requested=?,
     request_date=?, priority=?, status=? WHERE request_id=?`,
    [hospital_id, admin_id, blood_group, units_requested, request_date, priority, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Request updated!' });
    }
  );
});

// DELETE request
// DELETE request (Cleans up linked distributions first)
router.delete('/:id', (req, res) => {
  const requestId = req.params.id;

  // Step 1: Delete dependent records in DISTRIBUTION table
  db.query('DELETE FROM DISTRIBUTION WHERE request_id = ?', [requestId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to clear distribution tracking: ' + err.message });

    // Step 2: Delete the actual blood request
    db.query('DELETE FROM BLOOD_REQUEST WHERE request_id = ?', [requestId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json({ message: 'Request and related distribution records deleted!' });
    });
  });
});
module.exports = router;
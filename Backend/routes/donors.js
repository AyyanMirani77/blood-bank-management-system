const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all donors
router.get('/', (req, res) => {
  db.query('SELECT * FROM DONOR ORDER BY donor_id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single donor by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM DONOR WHERE donor_id = ?', [req.params.id], (err, results) => {
    if (err)             return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Donor not found' });
    res.json(results[0]);
  });
});

// POST add new donor
router.post('/', (req, res) => {
  const { name, blood_group, date_of_birth, gender, phone, address, health_status } = req.body;

  db.query(
    `INSERT INTO DONOR (name, blood_group, date_of_birth, gender, phone, address, health_status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, blood_group, date_of_birth || null, gender, phone, address, health_status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Donor added successfully!', donor_id: result.insertId });
    }
  );
});

// PUT update donor
router.put('/:id', (req, res) => {
  const { name, blood_group, date_of_birth, gender, phone, address, health_status } = req.body;

  db.query(
    `UPDATE DONOR SET name=?, blood_group=?, date_of_birth=?, gender=?, phone=?, address=?, health_status=?
     WHERE donor_id=?`,
    [name, blood_group, date_of_birth || null, gender, phone, address, health_status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Donor updated successfully!' });
    }
  );
});

// DELETE donor
// DELETE donor (Cleans up donations first)
router.delete('/:id', (req, res) => {
  const donorId = req.params.id;

  // Step 1: Delete all dependent records in DONATION table
  db.query('DELETE FROM DONATION WHERE donor_id = ?', [donorId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to clear donor history: ' + err.message });

    // Step 2: Now safe to delete the Donor
    db.query('DELETE FROM DONOR WHERE donor_id = ?', [donorId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Donor not found' });
      }
      res.json({ message: 'Donor and their donation history deleted successfully!' });
    });
  });
});
module.exports = router;
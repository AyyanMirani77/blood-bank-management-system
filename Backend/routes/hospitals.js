const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all hospitals
router.get('/', (req, res) => {
  db.query('SELECT * FROM HOSPITAL ORDER BY hospital_id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single hospital
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM HOSPITAL WHERE hospital_id = ?', [req.params.id], (err, results) => {
    if (err)             return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Hospital not found' });
    res.json(results[0]);
  });
});

// POST add hospital
router.post('/', (req, res) => {
  const { name, address, contact_person, phone, email } = req.body;

  db.query(
    `INSERT INTO HOSPITAL (name, address, contact_person, phone, email)
     VALUES (?, ?, ?, ?, ?)`,
    [name, address, contact_person, phone, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Hospital added!', hospital_id: result.insertId });
    }
  );
});

// PUT update hospital
router.put('/:id', (req, res) => {
  const { name, address, contact_person, phone, email } = req.body;

  db.query(
    `UPDATE HOSPITAL SET name=?, address=?, contact_person=?, phone=?, email=?
     WHERE hospital_id=?`,
    [name, address, contact_person, phone, email, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Hospital updated!' });
    }
  );
});

// DELETE hospital
// DELETE hospital (Cleans up distributions and blood requests first)
router.delete('/:id', (req, res) => {
  const hospitalId = req.params.id;

  // Step 1: Delete distributions linked to this hospital's requests
  const deleteDistributionsSql = `
    DELETE FROM DISTRIBUTION 
    WHERE request_id IN (SELECT request_id FROM BLOOD_REQUEST WHERE hospital_id = ?)
  `;

  db.query(deleteDistributionsSql, [hospitalId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to clear related distributions: ' + err.message });

    // Step 2: Delete blood requests linked to this hospital
    db.query('DELETE FROM BLOOD_REQUEST WHERE hospital_id = ?', [hospitalId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to clear hospital blood requests: ' + err.message });

      // Step 3: Now safe to delete the Hospital itself
      db.query('DELETE FROM HOSPITAL WHERE hospital_id = ?', [hospitalId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Hospital not found' });
        }
        res.json({ message: 'Hospital and all associated requests/distributions deleted!' });
      });
    });
  });
});
module.exports = router;
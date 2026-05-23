const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all blood stock
router.get('/', (req, res) => {
  db.query('SELECT * FROM BLOOD_STOCK ORDER BY stock_id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single stock entry
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM BLOOD_STOCK WHERE stock_id = ?', [req.params.id], (err, results) => {
    if (err)             return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Stock entry not found' });
    res.json(results[0]);
  });
});

// POST add new stock
router.post('/', (req, res) => {
  const { blood_group, units_available, collection_date, expiry_date, storage_location, status } = req.body;

  db.query(
    `INSERT INTO BLOOD_STOCK (blood_group, units_available, collection_date, expiry_date, storage_location, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [blood_group, units_available, collection_date, expiry_date, storage_location, status || 'Available'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Blood stock added!', stock_id: result.insertId });
    }
  );
});

// PUT update stock
router.put('/:id', (req, res) => {
  const { blood_group, units_available, collection_date, expiry_date, storage_location, status } = req.body;

  db.query(
    `UPDATE BLOOD_STOCK SET blood_group=?, units_available=?, collection_date=?, expiry_date=?, storage_location=?, status=?
     WHERE stock_id=?`,
    [blood_group, units_available, collection_date, expiry_date, storage_location, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Stock updated successfully!' });
    }
  );
});

// DELETE stock
// DELETE stock (Cleans up donations, distributions, and expiry logs first)
router.delete('/:id', (req, res) => {
  const stockId = req.params.id;

  // Step 1: Clear out associated donation tracking references
  db.query('DELETE FROM DONATION WHERE stock_id = ?', [stockId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to clear linked donations: ' + err.message });

    // Step 2: Clear out associated distributions
    db.query('DELETE FROM DISTRIBUTION WHERE stock_id = ?', [stockId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to clear linked distributions: ' + err.message });

      // Step 3: Clear out associated expiry logs
      db.query('DELETE FROM EXPIRY_LOG WHERE stock_id = ?', [stockId], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to clear linked expiry logs: ' + err.message });

        // Step 4: Delete the actual blood stock row
        db.query('DELETE FROM BLOOD_STOCK WHERE stock_id = ?', [stockId], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Stock entry not found' });
          }
          res.json({ message: 'Blood stock and all linked records completely deleted!' });
        });
      });
    });
  });
});
module.exports = router;
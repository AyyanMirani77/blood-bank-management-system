const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all donations (with donor name and admin name joined)
router.get('/', (req, res) => {
  const sql = `
    SELECT d.*, dn.name AS donor_name, a.name AS admin_name
    FROM DONATION d
    JOIN DONOR         dn ON d.donor_id = dn.donor_id
    JOIN ADMINISTRATOR  a ON d.admin_id  = a.admin_id
    ORDER BY d.donation_id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single donation
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM DONATION WHERE donation_id = ?', [req.params.id], (err, results) => {
    if (err)             return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Donation not found' });
    res.json(results[0]);
  });
});

// POST add donation
router.post('/', (req, res) => {
  const { donor_id, stock_id, admin_id, donation_date, units_donated, health_check_result } = req.body;

  db.query(
    `INSERT INTO DONATION (donor_id, stock_id, admin_id, donation_date, units_donated, health_check_result)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [donor_id, stock_id, admin_id, donation_date, units_donated, health_check_result],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Also update BLOOD_STOCK units
      db.query(
        'UPDATE BLOOD_STOCK SET units_available = units_available + ? WHERE stock_id = ?',
        [units_donated, stock_id]
      );

      // Update donor's last_donation_date
      db.query(
        'UPDATE DONOR SET last_donation_date = ? WHERE donor_id = ?',
        [donation_date, donor_id]
      );

      res.json({ message: 'Donation recorded!', donation_id: result.insertId });
    }
  );
});

// DELETE donation
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM DONATION WHERE donation_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Donation deleted!' });
  });
});

module.exports = router;
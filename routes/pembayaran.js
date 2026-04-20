const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Konfigurasi upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/bukti'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// ================================
// FORM UPLOAD
// ================================
router.get('/upload/:id', (req, res) => {
  const id = req.params.id;

  res.render('pembayaran/upload', {
    title: "Upload Bukti Pembayaran",
    id_pesanan: id,
    user: req.session.user
  });
});

// ================================
// PROSES UPLOAD
// ================================
router.post('/upload/:id', upload.single('bukti'), (req, res) => {
  const id = req.params.id;

  const sql = `INSERT INTO pembayaran(id_pesanan, metode, bukti) VALUES (?, 'Transfer Bank', ?)`;

  db.query(sql, [id, req.file.filename], (err) => {
    if (err) throw err;

    // Update status pesanan
    db.query(`UPDATE pesanan SET status_pesanan='Menunggu Verifikasi' WHERE id=?`, [id]);

    res.redirect(`/pesanan/detail_user/${id}`);
  });
});

module.exports = router;

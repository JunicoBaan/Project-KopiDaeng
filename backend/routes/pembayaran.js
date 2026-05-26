const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const { verifyToken, isAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// ================================
// PROSES UPLOAD PEMBAYARAN
// ================================
router.post('/upload/:id', verifyToken, upload.single('bukti'), (req, res) => {
  const id = req.params.id;
  
  if (!req.file) return res.status(400).json({ message: 'Bukti pembayaran wajib diupload' });

  const sql = `INSERT INTO pembayaran(id_pesanan, metode, bukti) VALUES (?, 'Transfer Bank', ?)`;

  db.query(sql, [id, req.file.filename], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal memproses pembayaran' });

    // Update status pesanan
    db.query(`UPDATE pesanan SET status_pesanan='Menunggu Verifikasi' WHERE id=?`, [id]);

    res.json({ message: 'Bukti pembayaran berhasil diupload' });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const { verifyToken, isAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

//Tambah data pengiriman (Admin)
router.post('/tambah', verifyToken, isAdmin, upload.single('foto_bukti'), (req, res) => {
  const { id_pesanan, jasa_kurir, nomor_resi, tanggal_kirim } = req.body;
  const status_kirim = 'Dikirim';
  const foto_bukti = req.file ? req.file.filename : null;

  //Cegah duplikasi pengiriman
  const checkQuery = 'SELECT id FROM pengiriman WHERE id_pesanan = ?';
  db.query(checkQuery, [id_pesanan], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error database' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Pengiriman untuk pesanan ini sudah ada.' });
    }

    const insertQuery = `
      INSERT INTO pengiriman (id_pesanan, jasa_kurir, nomor_resi, status_kirim, tanggal_kirim, foto_bukti)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [id_pesanan, jasa_kurir, nomor_resi, status_kirim, tanggal_kirim, foto_bukti], (err2) => {
      if (err2) return res.status(500).json({ message: 'Gagal membuat pengiriman' });

      // Update status pesanan jadi "Dikirim"
      db.query('UPDATE pesanan SET status_pesanan = ? WHERE id = ?', ['Dikirim', id_pesanan], (err3) => {
        if (err3) console.error(err3);
        res.status(201).json({ message: 'Data pengiriman berhasil disimpan!' });
      });
    });
  });
});

//Update status pengiriman (Admin)
router.put('/update/:id', verifyToken, isAdmin, (req, res) => {
  const { status_kirim } = req.body;
  const id = req.params.id;

  db.query('UPDATE pengiriman SET status_kirim = ? WHERE id = ?', [status_kirim, id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal mengupdate pengiriman' });
    res.json({ message: 'Status pengiriman berhasil diperbarui.' });
  });
});

module.exports = router;

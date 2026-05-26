const express = require('express');
const router = express.Router();
const Produk = require('../models/Model_Produk');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

// Upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Simpan di direktori uploads backend
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

//CRUD Produk(Admin & User)

// GET All Produk (Bisa diakses publik atau user untuk katalog)
router.get('/', (req, res) => {
  const q = (req.query.q || '').trim();

  if (q) {
    Produk.search(q, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching data' });
        res.json({ produk: results });
    });
  } else {
    Produk.getAll((err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching data' });
      res.json({ produk: results });
    });
  }
});

// GET All Kategori
router.get('/kategori/all', (req, res) => {
  const Kategori = require('../models/Model_Kategori');
  Kategori.getAll((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching kategori' });
    }
    res.json({ kategori: results });
  });
});

// GET Detail Produk
router.get('/:id', (req, res) => {
  const id = req.params.id;

  const queryProduk = `SELECT * FROM produk WHERE id = ?`;
  const queryUlasan = `
      SELECT u.nama AS nama_user, ul.rating, ul.komentar, ul.tanggal
      FROM ulasan ul
      JOIN users u ON u.id = ul.id_user
      WHERE ul.id_produk = ?
      ORDER BY ul.tanggal DESC
  `;

  db.query(queryProduk, [id], (err, produkResult) => {
    if (err) return res.status(500).json({ message: 'Error fetching produk' });
    if (produkResult.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    db.query(queryUlasan, [id], (err2, ulasanResult) => {
      if (err2) return res.status(500).json({ message: 'Error fetching ulasan' });

      res.json({
        produk: produkResult[0],
        ulasan: ulasanResult
      });
    });
  });
});

// POST Create Produk (Admin)
router.post('/', verifyToken, isAdmin, upload.single('gambar'), (req, res) => {
  const data = {
    id_kategori: req.body.id_kategori,
    nama_produk: req.body.nama_produk,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    stok: req.body.stok ? parseInt(req.body.stok, 10) : 0,
    gambar: req.file ? req.file.filename : null,
  };

  Produk.create(data, (err) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating produk' });
    }
    res.status(201).json({ message: 'Produk berhasil dibuat', data });
  });
});

// PUT Update Produk (Admin)
router.post('/edit/:id', verifyToken, isAdmin, upload.single('gambar'), (req, res) => {
  const data = {
    id_kategori: req.body.id_kategori,
    nama_produk: req.body.nama_produk,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    stok: req.body.stok ? parseInt(req.body.stok, 10) : 0,
    gambar: req.file ? req.file.filename : req.body.old_gambar,
  };

  Produk.update(req.params.id, data, (err) => {
    if (err) return res.status(500).json({ message: 'Error updating produk' });
    res.json({ message: 'Produk berhasil diupdate' });
  });
});

// DELETE Produk (Admin)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  Produk.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting produk' });
    res.json({ message: 'Produk berhasil dihapus' });
  });
});

//simpan ulasan produk(user)
router.post('/:id/ulasan', verifyToken, isUser, (req, res) => {
  const id_produk = req.params.id;
  const id_user = req.userId;
  const { rating, komentar } = req.body;

  const query = `
      INSERT INTO ulasan (id_produk, id_user, rating, komentar, tanggal)
      VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [id_produk, id_user, rating, komentar], (err) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal mengirim ulasan' });
    }
    res.status(201).json({ message: 'Ulasan berhasil terkirim!' });
  });
});

module.exports = router;
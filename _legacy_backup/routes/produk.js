var express = require('express');
var router = express.Router();
const Produk = require('../model/Model_Produk');
const Kategori = require('../model/Model_Kategori');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// ======================================================
// 🔒 MIDDLEWARE CEK ROLE
// ======================================================
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('message', 'Akses hanya untuk admin!');
  return res.redirect('/produk/katalog');
}

function isUser(req, res, next) {
  if (req.session.user && req.session.user.role === 'user') return next();
  req.flash('message', 'Silakan login sebagai user!');
  return res.redirect('/users/login');
}

// ======================================================
// 🔧 Konfigurasi Upload Gambar
// ======================================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// ======================================================
// 📌 CRUD PRODUK (ADMIN)
// ======================================================
router.get('/', isAdmin, (req, res) => {
  Produk.getAll((err, results) => {
    if (err) throw err;
    res.render('produk/index', { produk: results });
  });
});

router.get('/create', isAdmin, (req, res) => {
  Kategori.getAll((err, kategori) => {
    if (err) throw err;
    res.render('produk/create', { kategori });
  });
});

router.post('/create', isAdmin, upload.single('gambar'), (req, res) => {
  const data = {
    id_kategori: req.body.id_kategori,
    nama_produk: req.body.nama_produk,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    stok: req.body.stok ? parseInt(req.body.stok, 10) : 0,
    gambar: req.file ? req.file.filename : null,
  };

  Produk.create(data, (err) => {
    if (err) throw err;
    res.redirect('/produk');
  });
});

router.get('/edit/:id', isAdmin, (req, res) => {
  Produk.getById(req.params.id, (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.redirect('/produk');

    Kategori.getAll((err2, kategori) => {
      if (err2) throw err2;
      res.render('produk/edit', { produk: result[0], kategori });
    });
  });
});

router.post('/edit/:id', isAdmin, upload.single('gambar'), (req, res) => {
  const data = {
    id_kategori: req.body.id_kategori,
    nama_produk: req.body.nama_produk,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    stok: req.body.stok ? parseInt(req.body.stok, 10) : 0,
    gambar: req.file ? req.file.filename : req.body.old_gambar,
  };

  Produk.update(req.params.id, data, (err) => {
    if (err) throw err;
    res.redirect('/produk');
  });
});

router.get('/delete/:id', isAdmin, (req, res) => {
  Produk.delete(req.params.id, (err) => {
    if (err) throw err;
    res.redirect('/produk');
  });
});

// ======================================================
// 👤 USER - KATALOG + PENCARIAN
// ======================================================
router.get('/katalog', isUser, (req, res) => {
  const q = (req.query.q || '').trim();

  if (q) {
    const like = `%${q}%`;
    const query = `
      SELECT * FROM produk
      WHERE nama_produk LIKE ? OR deskripsi LIKE ?
      ORDER BY id DESC
    `;

    db.query(query, [like, like], (err, results) => {
      if (err) throw err;
      const message = results.length === 0
        ? `Tidak ada produk ditemukan untuk "${q}".`
        : null;

      res.render('pelanggan/produk', {
        produk: results,
        user: req.session.user,
        query: q,
        message: message
      });
    });
  } else {
    Produk.getAll((err, results) => {
      if (err) throw err;
      res.render('pelanggan/produk', {
        produk: results,
        user: req.session.user,
        query: '',
        message: null
      });
    });
  }
});

// ======================================================
// 📌 DETAIL PRODUK + TAMPIL ULASAN
// ======================================================
router.get('/detail/:id', (req, res) => {
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
    if (err) throw err;

    db.query(queryUlasan, [id], (err2, ulasanResult) => {
      if (err2) throw err2;

      res.render('produk/detail', {
        produk: produkResult[0],
        ulasan: ulasanResult,
        user: req.session.user
      });
    });
  });
});

// ======================================================
// ⭐ GET FORM ULASAN (FIX ERROR 404)
// ======================================================
router.get('/ulasan/tambah/:id_produk', isUser, (req, res) => {
  const id_produk = req.params.id_produk;

  db.query("SELECT * FROM produk WHERE id = ?", [id_produk], (err, result) => {
    if (err) throw err;

    res.render("ulasan/tambah", {
      produk: result[0],
      user: req.session.user
    });
  });
});

// ======================================================
// ⭐ SIMPAN ULASAN PRODUK
// ======================================================
router.post('/ulasan/tambah/:id_produk', isUser, (req, res) => {
  const id_produk = req.params.id_produk;
  const id_user = req.session.user.id;
  const { rating, komentar } = req.body;

  const query = `
      INSERT INTO ulasan (id_produk, id_user, rating, komentar, tanggal)
      VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [id_produk, id_user, rating, komentar], (err) => {
    if (err) throw err;

    req.flash('message', 'Ulasan berhasil terkirim!');
    res.redirect('/produk/detail/' + id_produk);
  });
});

module.exports = router;

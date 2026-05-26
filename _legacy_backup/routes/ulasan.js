var express = require('express');
var router = express.Router();
const db = require('../config/db');

// Middleware cek user login
function isUser(req, res, next) {
  if (req.session.user && req.session.user.role === "user") return next();
  res.redirect('/users/login');
}

// ====== GET FORM ULASAN ======
router.get('/tambah/:id_produk', isUser, (req, res) => {
  const id_produk = req.params.id_produk;

  db.query("SELECT * FROM produk WHERE id = ?", [id_produk], (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.send("Produk tidak ditemukan");

    res.render("ulasan/tambah", {
      produk: result[0],
      user: req.session.user
    });
  });
});

// ====== POST SIMPAN ULASAN ======
router.post('/tambah/:id_produk', isUser, (req, res) => {
  const id_produk = req.params.id_produk;
  const id_user = req.session.user.id;
  const { rating, komentar } = req.body;

  const data = {
    id_produk,
    id_user,
    rating,
    komentar,
    tanggal: new Date()
  };

  db.query("INSERT INTO ulasan SET ?", data, (err) => {
    if (err) throw err;
    res.redirect('/produk/detail/' + id_produk);
  });
});

module.exports = router;

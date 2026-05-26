const express = require('express');
const router = express.Router();
const Produk = require('../model/Model_Produk');

// Middleware agar user login dulu sebelum beli
const isLogged = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') return next();
  req.flash('message', 'Silakan login sebagai pengguna terlebih dahulu.');
  res.redirect('/users/login');
};

// Halaman katalog produk untuk pelanggan
router.get('/produk', isLogged, (req, res) => {
  Produk.getAll((err, results) => {
    if (err) throw err;
    res.render('pelanggan/produk', { produk: results, user: req.session.user });
  });
});

module.exports = router;

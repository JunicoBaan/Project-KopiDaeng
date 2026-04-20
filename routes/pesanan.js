var express = require('express');
var router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// ====================================================
// ⚙ Upload Bukti (Transfer / Penerimaan Barang)
// ====================================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ====================================================
// 🛡️ Middleware Admin
// ====================================================
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('message', 'Akses hanya untuk admin!');
  return res.redirect('/');
}

// ====================================================
// 🧾 1️⃣ Halaman daftar pesanan ADMIN
// ====================================================
router.get('/', isAdmin, (req, res) => {
  let { start, end } = req.query;

  let query = `
    SELECT 
      p.id,
      u.nama AS nama_pelanggan,
      p.tanggal_pesanan,
      p.total_harga,
      p.status_pesanan
    FROM pesanan p
    JOIN users u ON p.id_user = u.id
  `;

  let params = [];

  if (start && end) {
    query += ` WHERE DATE(p.tanggal_pesanan) BETWEEN ? AND ? `;
    params.push(start, end);
  }

  query += ` ORDER BY p.tanggal_pesanan DESC`;

  db.query(query, params, (err, results) => {
    if (err) throw err;

    res.render('pesanan/admin', {
      pesanan: results,
      user: req.session.user,
      start,
      end
    });
  });
});

// ====================================================
// 🧾 2️⃣ Detail pesanan ADMIN
// ====================================================
router.get('/detail/:id', isAdmin, (req, res) => {
  const idPesanan = req.params.id;

  const queryPesanan = `
    SELECT 
      p.*, 
      u.nama AS nama_pelanggan,
      u.email
    FROM pesanan p
    JOIN users u ON p.id_user = u.id
    WHERE p.id = ?
  `;

  const queryDetail = `
    SELECT 
      dp.id_produk,
      pr.nama_produk,
      dp.jumlah,
      dp.hargaSaat_pesan,
      (dp.jumlah * dp.hargaSaat_pesan) AS subtotal
    FROM detail_pesanan dp
    JOIN produk pr ON dp.id_produk = pr.id
    WHERE dp.id_pesanan = ?
  `;

  db.query(queryPesanan, [idPesanan], (err, pesananResult) => {
    if (err) throw err;

    if (pesananResult.length === 0) {
      req.flash('message', 'Pesanan tidak ditemukan.');
      return res.redirect('/pesanan');
    }

    db.query(queryDetail, [idPesanan], (err2, detailResult) => {
      if (err2) throw err2;

      res.render('pesanan/detail', {
        pesanan: pesananResult[0],
        detail: detailResult,
        user: req.session.user
      });
    });
  });
});

// ====================================================
// 🔄 3️⃣ Update status pesanan ADMIN
// ====================================================
router.post('/update-status/:id', isAdmin, (req, res) => {
  const { status_pesanan } = req.body;
  const id = req.params.id;

  db.query('UPDATE pesanan SET status_pesanan=? WHERE id=?', 
  [status_pesanan, id], () => {

    req.flash('message', 'Status pesanan diperbarui!');
    res.redirect('/pesanan/detail/' + id);
  });
});

// ====================================================
// 👤 4️⃣ Pesanan Saya (User)
// ====================================================
router.get('/saya', (req, res) => {
  if (!req.session.user) return res.redirect('/users/login');

  const idUser = req.session.user.id;

  db.query(`
    SELECT id, tanggal_pesanan, total_harga, status_pesanan
    FROM pesanan
    WHERE id_user = ?
    ORDER BY tanggal_pesanan DESC
  `, [idUser], (err, results) => {
    if (err) throw err;

    res.render('pesanan/index', {
      pesanan: results,
      user: req.session.user
    });
  });
});

// ====================================================
// 4️⃣ DETAIL PESANAN USER
// ====================================================
router.get('/saya/detail/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/users/login');

  const idPesanan = req.params.id;
  const idUser = req.session.user.id;

  const queryPesanan = `
    SELECT 
      p.*, 
      g.jasa_kurir,
      g.nomor_resi,
      g.tanggal_kirim,
      g.status_kirim,
      g.foto_bukti
    FROM pesanan p
    LEFT JOIN pengiriman g ON p.id = g.id_pesanan
    WHERE p.id = ? AND p.id_user = ?
  `;

  const queryDetail = `
    SELECT 
      dp.id_produk,
      pr.nama_produk,
      dp.jumlah,
      dp.hargaSaat_pesan,
      (dp.jumlah * dp.hargaSaat_pesan) AS subtotal
    FROM detail_pesanan dp
    JOIN produk pr ON dp.id_produk = pr.id
    WHERE dp.id_pesanan = ?
  `;

  db.query(queryPesanan, [idPesanan, idUser], (err, pesananResult) => {
    if (err) throw err;

    db.query(queryDetail, [idPesanan], (err2, detailResult) => {
      if (err2) throw err2;

      res.render('pesanan/detail_user', {
        pesanan: pesananResult[0],
        detail: detailResult,
        user: req.session.user
      });
    });
  });
});

// ====================================================
// 5️⃣ Checkout
// ====================================================
router.get('/tambah/:id_produk', (req, res) => {
  if (!req.session.user) return res.redirect('/users/login');

  db.query("SELECT * FROM produk WHERE id = ?", 
  [req.params.id_produk], (err, result) => {

    res.render('pesanan/checkout', {
      produk: result[0],
      user: req.session.user
    });
  });
});

// ====================================================
// 6️⃣ Proses Checkout
// ====================================================
router.post('/checkout', (req, res) => {
  if (!req.session.user) return res.redirect('/users/login');

  const { id_produk, jumlah, alamat, telepon, metode_pembayaran } = req.body;
  const id_user = req.session.user.id;

  db.query(`SELECT harga, stok FROM produk WHERE id = ?`, 
  [id_produk], (err, result) => {

    const { harga, stok } = result[0];
    const total = harga * jumlah;

    if (stok < jumlah) {
      req.flash('message', 'Stok tidak cukup.');
      return res.redirect('/produk/katalog');
    }

    db.query(`
      INSERT INTO pesanan (id_user, alamat, telepon, metode_pembayaran, total_harga, status_pesanan)
      VALUES (?, ?, ?, ?, ?, 'Menunggu Pembayaran')
    `, [id_user, alamat, telepon, metode_pembayaran, total], 
    (err2, resultOrder) => {

      const id_pesanan = resultOrder.insertId;

      db.query(`
        INSERT INTO detail_pesanan (id_pesanan, id_produk, jumlah, hargaSaat_pesan)
        VALUES (?, ?, ?, ?)
      `, [id_pesanan, id_produk, jumlah, harga]);

      db.query(`UPDATE produk SET stok = stok - ? WHERE id = ?`, [jumlah, id_produk]);

      if (metode_pembayaran === "Transfer Bank") {
        return res.redirect('/pesanan/upload-bukti/' + id_pesanan);
      }

      req.flash('message', 'Pesanan berhasil!');
      res.redirect('/pesanan/saya');
    });
  });
});

// ====================================================
// 7️⃣ Upload Bukti Transfer
// ====================================================
router.get('/upload-bukti/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/users/login');

  db.query("SELECT * FROM pesanan WHERE id = ?", [req.params.id], (err, result) => {
    res.render('pesanan/upload_bukti', {
      pesanan: result[0],
      user: req.session.user
    });
  });
});

// ====================================================
// 8️⃣ Simpan Bukti Transfer
// ====================================================
router.post('/upload-bukti/:id', upload.single('bukti_transfer'), (req, res) => {
  const id = req.params.id;
  const fileName = req.file.filename;

  db.query(`
    UPDATE pesanan 
    SET bukti_transfer=?, status_pesanan='Menunggu Verifikasi'
    WHERE id=?
  `, [fileName, id], () => {
    req.flash('message', 'Bukti pembayaran berhasil dikirim!');
    res.redirect('/pesanan/saya');
  });
});

// ====================================================
// 9️⃣ Konfirmasi pesanan diterima user
// ====================================================
router.post('/saya/terima/:id', upload.single('foto_bukti'), (req, res) => {
  const id = req.params.id;
  const foto = req.file ? req.file.filename : null;

  db.query(`
    UPDATE pesanan 
    SET status_pesanan='Selesai'
    WHERE id=?
  `, [id]);

  db.query(`
    UPDATE pengiriman 
    SET status_kirim='Diterima', foto_bukti=?
    WHERE id_pesanan=?
  `, [foto, id], () => {

    req.flash('message', 'Pesanan berhasil dikonfirmasi!');
    res.redirect('/pesanan/saya');
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Middleware pastikan hanya admin// 
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('message', 'Akses hanya untuk admin!');
  return res.redirect('/');
}


const uploadDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


//Konfigurasi upload foto bukti pengiriman// 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


//Tambah data pengiriman (Admin)//
router.post('/tambah', isAdmin, upload.single('foto_bukti'), (req, res) => {
  const { id_pesanan, jasa_kurir, nomor_resi, tanggal_kirim } = req.body;
  const status_kirim = 'Dikirim';
  const foto_bukti = req.file ? req.file.filename : null;

  //Cegah duplikasi pengiriman
  const checkQuery = 'SELECT id FROM pengiriman WHERE id_pesanan = ?';
  db.query(checkQuery, [id_pesanan], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      req.flash('message', '⚠️ Pengiriman untuk pesanan ini sudah ada.');
      return res.redirect(`/pesanan/detail/${id_pesanan}`);
    }

    const insertQuery = `
      INSERT INTO pengiriman (id_pesanan, jasa_kurir, nomor_resi, status_kirim, tanggal_kirim, foto_bukti)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [id_pesanan, jasa_kurir, nomor_resi, status_kirim, tanggal_kirim, foto_bukti], (err2) => {
      if (err2) throw err2;

      // Update status pesanan jadi "Dikirim"
      db.query('UPDATE pesanan SET status_pesanan = ? WHERE id = ?', ['Dikirim', id_pesanan], (err3) => {
        if (err3) throw err3;

        req.flash('message', '✅ Data pengiriman berhasil disimpan!');
        res.redirect(`/pesanan/detail/${id_pesanan}`);
      });
    });
  });
});


//Update status pengiriman (Admin) // 
router.post('/update/:id', isAdmin, (req, res) => {
  const { status_kirim } = req.body;
  const id = req.params.id;

  db.query('UPDATE pengiriman SET status_kirim = ? WHERE id = ?', [status_kirim, id], (err) => {
    if (err) throw err;
    req.flash('message', '✅ Status pengiriman berhasil diperbarui.');
    res.redirect('/pesanan');
  });
});


// untuk user Konfirmasi Pesanan Diterima// 
router.post('/terima/:id_pesanan', upload.single('foto_bukti'), (req, res) => {
  const id_pesanan = req.params.id_pesanan;
  const foto_bukti = req.file ? req.file.filename : null;

  const updateQuery = `
    UPDATE pengiriman
    SET status_kirim = 'Diterima', foto_bukti = ?
    WHERE id_pesanan = ?
  `;

  db.query(updateQuery, [foto_bukti, id_pesanan], (err) => {
    if (err) throw err;

    // Ubah status pesanan juga menjadi “Selesai”
    db.query('UPDATE pesanan SET status_pesanan = ? WHERE id = ?', ['Selesai', id_pesanan], (err2) => {
      if (err2) throw err2;

      req.flash('message', '✅ Terima kasih! Pesanan berhasil dikonfirmasi diterima.');
      res.redirect('/pesanan/saya');
    });
  });
});

//Detail Pengiriman (Admin/User)// 
router.get('/detail/:id_pesanan', (req, res) => {
  const id_pesanan = req.params.id_pesanan;

  const query = `
    SELECT 
      g.*, p.alamat, p.telepon, p.total_harga, p.status_pesanan,
      u.nama AS nama_pelanggan
    FROM pengiriman g
    JOIN pesanan p ON g.id_pesanan = p.id
    JOIN users u ON p.id_user = u.id
    WHERE g.id_pesanan = ?
  `;

  db.query(query, [id_pesanan], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      req.flash('message', 'Data pengiriman tidak ditemukan.');
      return res.redirect('/pesanan');
    }

    res.render('pengiriman/detail', {
      pengiriman: result[0],
      user: req.session.user
    });
  });
});

module.exports = router;

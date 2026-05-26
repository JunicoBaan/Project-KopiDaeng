const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

// upload bukti
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

//daftar pesanan(admin)
router.get('/', verifyToken, isAdmin, (req, res) => {
  let { start, end } = req.query;

  let query = `
    SELECT 
      p.id,
      u.nama AS nama_pelanggan,
      p.tanggal_pesanan,
      p.total_harga,
      p.status_pesanan,
      p.bukti_transfer,
      p.metode_pembayaran
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
    if (err) return res.status(500).json({ message: 'Error fetching pesanan' });
    res.json({ pesanan: results });
  });
});

//detail pesanan admin/user
router.get('/detail/:id', verifyToken, (req, res) => {
  const idPesanan = req.params.id;
  const isUserOnly = req.userRole === 'user';
  
  let queryPesanan = `
    SELECT 
      p.*, 
      u.nama AS nama_pelanggan,
      u.email,
      g.jasa_kurir,
      g.nomor_resi,
      g.tanggal_kirim,
      g.status_kirim,
      g.foto_bukti as bukti_pengiriman
    FROM pesanan p
    JOIN users u ON p.id_user = u.id
    LEFT JOIN pengiriman g ON p.id = g.id_pesanan
    WHERE p.id = ?
  `;
  
  let queryParams = [idPesanan];
  
  if (isUserOnly) {
      queryPesanan += ` AND p.id_user = ?`;
      queryParams.push(req.userId);
  }

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

  db.query(queryPesanan, queryParams, (err, pesananResult) => {
    if (err) return res.status(500).json({ message: 'Error fetching pesanan' });
    if (pesananResult.length === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan atau bukan milik Anda' });

    db.query(queryDetail, [idPesanan], (err2, detailResult) => {
      if (err2) return res.status(500).json({ message: 'Error fetching detail pesanan' });

      res.json({
        pesanan: pesananResult[0],
        detail: detailResult
      });
    });
  });
});

//update status pesanan(admin)
router.post('/update-status/:id', verifyToken, isAdmin, (req, res) => {
  const { status_pesanan } = req.body;
  const id = req.params.id;

  db.query('UPDATE pesanan SET status_pesanan=? WHERE id=?', 
  [status_pesanan, id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal update status pesanan' });
    res.json({ message: 'Status pesanan diperbarui!' });
  });
});

//pesanan saya (User)
router.get('/saya', verifyToken, isUser, (req, res) => {
  const idUser = req.userId;

  db.query(`
    SELECT id, tanggal_pesanan, total_harga, status_pesanan
    FROM pesanan
    WHERE id_user = ?
    ORDER BY tanggal_pesanan DESC
  `, [idUser], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching pesanan saya' });
    res.json({ pesanan: results });
  });
});

//Proses checkout
router.post('/checkout', verifyToken, isUser, (req, res) => {
  const { items, alamat, telepon, metode_pembayaran } = req.body;
  const id_user = req.userId;
  
  if(!items || items.length === 0) return res.status(400).json({ message: 'Keranjang kosong' });
  const { id_produk, jumlah } = items[0]; 

  db.query(`SELECT harga, stok FROM produk WHERE id = ?`, 
  [id_produk], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (result.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const { harga, stok } = result[0];
    const total = harga * jumlah;

    if (stok < jumlah) {
      return res.status(400).json({ message: 'Stok tidak cukup' });
    }

    db.query(`
      INSERT INTO pesanan (id_user, alamat, telepon, metode_pembayaran, total_harga, status_pesanan)
      VALUES (?, ?, ?, ?, ?, 'Menunggu Verifikasi')
    `, [id_user, alamat, telepon, metode_pembayaran, total], 
    (err2, resultOrder) => {
        if (err2) return res.status(500).json({ message: 'Gagal membuat pesanan' });
        
        const id_pesanan = resultOrder.insertId;

        db.query(`
            INSERT INTO detail_pesanan (id_pesanan, id_produk, jumlah, hargaSaat_pesan)
            VALUES (?, ?, ?, ?)
        `, [id_pesanan, id_produk, jumlah, harga]);

        db.query(`UPDATE produk SET stok = stok - ? WHERE id = ?`, [jumlah, id_produk]);

        res.status(201).json({ message: 'Pesanan berhasil dibuat', id_pesanan });
    });
  });
});

//simpan bukti transfer
router.post('/upload-bukti/:id', verifyToken, isUser, upload.single('bukti_transfer'), (req, res) => {
  const id = req.params.id;
  const fileName = req.file ? req.file.filename : null;
  
  if (!fileName) return res.status(400).json({ message: 'Bukti transfer wajib diupload' });

  db.query(`
    UPDATE pesanan 
    SET bukti_transfer=?, status_pesanan='Menunggu Verifikasi'
    WHERE id=? AND id_user=?
  `, [fileName, id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal upload bukti transfer' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    res.json({ message: 'Bukti pembayaran berhasil dikirim!' });
  });
});

//konfirmasi pesanan diterima user
router.post('/saya/terima/:id', verifyToken, isUser, upload.single('foto_bukti'), (req, res) => {
  const id = req.params.id;
  const foto = req.file ? req.file.filename : null;

  db.query(`
    UPDATE pesanan 
    SET status_pesanan='Selesai'
    WHERE id=? AND id_user=?
  `, [id, req.userId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

      db.query(`
        UPDATE pengiriman 
        SET status_kirim='Diterima', foto_bukti=?
        WHERE id_pesanan=?
      `, [foto, id], (err2) => {
        if(err2) console.error(err2);
        res.json({ message: 'Pesanan berhasil dikonfirmasi!' });
      });
  });
});

module.exports = router;

const db = require('../config/db');

const Pesanan = {
  // create pesanan utama, returns insertId
  createOrder: (data, callback) => {
    const query = `INSERT INTO pesanan (id_user, tanggal_pesanan, total_harga, status_pesanan)
                   VALUES (?, NOW(), ?, ?)`;
    db.query(query, [data.id_user, data.total_harga, data.status_pesanan || 'Menunggu Pembayaran'], callback);
  },

  // create detail pesanan (multiple). details = [{id_produk, jumlah, hargaSaat_pesan}, ...]
  createDetails: (orderId, details, callback) => {
    if (!details || details.length === 0) return callback(null, null);
    const values = details.map(d => [orderId, d.id_produk, d.jumlah, d.hargaSaat_pesan]);
    const query = `INSERT INTO detail_pesanan (id_pesanan, id_produk, jumlah, hargaSaat_pesan) VALUES ?`;
    db.query(query, [values], callback);
  },

  // ambil semua pesanan milik user (ringkasan)
  getByUser: (userId, callback) => {
    const q = `SELECT p.* FROM pesanan p WHERE p.id_user = ? ORDER BY p.tanggal_pesanan DESC`;
    db.query(q, [userId], callback);
  },

  // ambil semua detail untuk pesanan tertentu
  getDetailsByOrder: (orderId, callback) => {
    const q = `
      SELECT dp.*, pr.nama_produk, pr.gambar
      FROM detail_pesanan dp
      LEFT JOIN produk pr ON dp.id_produk = pr.id
      WHERE dp.id_pesanan = ?
    `;
    db.query(q, [orderId], callback);
  },

  // ambil semua pesanan (admin)
  getAll: (callback) => {
    const q = `
      SELECT p.*, u.nama AS nama_user, u.email
      FROM pesanan p
      LEFT JOIN users u ON p.id_user = u.id
      ORDER BY p.tanggal_pesanan DESC
    `;
    db.query(q, callback);
  },

  // update status pesanan
  updateStatus: (orderId, newStatus, callback) => {
    const q = `UPDATE pesanan SET status_pesanan = ? WHERE id = ?`;
    db.query(q, [newStatus, orderId], callback);
  },

  // reduce stok produk after checkout (jumlah)
  reduceStock: (id_produk, jumlah, callback) => {
    const q = `UPDATE produk SET stok = GREATEST(0, stok - ?) WHERE id = ?`;
    db.query(q, [jumlah, id_produk], callback);
  },

  // ambil detail lengkap order (header + detail)
  getOrderWithDetails: (orderId, callback) => {
    const q1 = `SELECT p.*, u.nama AS nama_user, u.email, u.telepon, u.alamat
                FROM pesanan p
                LEFT JOIN users u ON p.id_user = u.id
                WHERE p.id = ?`;
    db.query(q1, [orderId], (err, rows) => {
      if (err) return callback(err);
      if (!rows || rows.length === 0) return callback(null, null);
      const order = rows[0];
      Pesanan.getDetailsByOrder(orderId, (err2, details) => {
        if (err2) return callback(err2);
        order.details = details;
        callback(null, order);
      });
    });
  }
};

module.exports = Pesanan;

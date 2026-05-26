const db = require('../config/db');

const Produk = {
  getAll: (callback) => {
    const query = `
      SELECT produk.*, kategori.nama_kategori, 
             COALESCE(AVG(ulasan.rating), 0) as avg_rating,
             COUNT(ulasan.id) as ulasan_count
      FROM produk 
      LEFT JOIN kategori ON produk.id_kategori = kategori.id
      LEFT JOIN ulasan ON produk.id = ulasan.id_produk
      GROUP BY produk.id
      ORDER BY avg_rating DESC, ulasan_count DESC, produk.id DESC
    `;
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = `
      SELECT produk.*, kategori.nama_kategori 
      FROM produk 
      LEFT JOIN kategori ON produk.id_kategori = kategori.id
      WHERE produk.id = ?
    `;
    db.query(query, [id], callback);
  },

  //pencarian dinamis
  search: (q, callback) => {
    const like = '%' + q + '%';
    const query = `
      SELECT produk.*, kategori.nama_kategori,
             COALESCE(AVG(ulasan.rating), 0) as avg_rating,
             COUNT(ulasan.id) as ulasan_count
      FROM produk
      LEFT JOIN kategori ON produk.id_kategori = kategori.id
      LEFT JOIN ulasan ON produk.id = ulasan.id_produk
      WHERE produk.nama_produk LIKE ? OR kategori.nama_kategori LIKE ?
      GROUP BY produk.id
      ORDER BY avg_rating DESC, ulasan_count DESC, produk.id DESC
    `;
    db.query(query, [like, like], callback);
  },

  create: (data, callback) => {
    const query = `
      INSERT INTO produk (id_kategori, nama_produk, deskripsi, harga, gambar, stok) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [data.id_kategori, data.nama_produk, data.deskripsi, data.harga, data.gambar, data.stok], callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE produk 
      SET id_kategori=?, nama_produk=?, deskripsi=?, harga=?, gambar=?, stok=? 
      WHERE id=?
    `;
    db.query(query, [data.id_kategori, data.nama_produk, data.deskripsi, data.harga, data.gambar, data.stok, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM produk WHERE id=?', [id], callback);
  }
};

module.exports = Produk;

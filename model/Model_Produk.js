const db = require('../config/db');

const Produk = {
  getAll: (callback) => {
    const query = `
      SELECT produk.*, kategori.nama_kategori 
      FROM produk 
      LEFT JOIN kategori ON produk.id_kategori = kategori.id
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

  // <-- NEW: search by q (nama_produk OR deskripsi)
  search: (q, callback) => {
    const like = '%' + q + '%';
    const query = `
      SELECT produk.*, kategori.nama_kategori
      FROM produk
      LEFT JOIN kategori ON produk.id_kategori = kategori.id
      WHERE produk.nama_produk LIKE ? OR produk.deskripsi LIKE ?
      ORDER BY produk.id DESC
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

const db = require('../config/db');

const User = {
  // 🔹 Registrasi user baru
  register: (data, callback) => {
    const query = 'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [data.nama, data.email, data.password, data.role], callback);
  },

  // 🔹 Cari user berdasarkan email
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  // 🔹 Ambil semua user (untuk admin dashboard)
  getAll: (callback) => {
    const query = 'SELECT id, nama, email, alamat, telepon, role FROM users ORDER BY id DESC';
    db.query(query, callback);
  }
};

module.exports = User;

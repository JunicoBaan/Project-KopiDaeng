const db = require('../config/db');

const Kategori = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM kategori ORDER BY nama_kategori ASC';
    db.query(sql, callback);
  },
};

module.exports = Kategori;

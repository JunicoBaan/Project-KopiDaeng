const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Model_User');
const db = require('../config/db');
const { verifyToken, isAdmin, JWT_SECRET } = require('../middleware/auth');

//Halaman Manajemen Users (hanya untuk admin)
router.get('/manage', verifyToken, isAdmin, (req, res) => {
  const query = `
    SELECT id, nama, email, role, status, last_login,
    TIMESTAMPDIFF(DAY, last_login, NOW()) AS days_inactive
    FROM users
  `;
  db.query(query, (err, users) => {
    if (err) {
      console.error('Error mengambil data users:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data user.' });
    }
    res.json({ users });
  });
});

//Dapatkan satu user untuk Edit (Admin)
router.get('/:id', verifyToken, isAdmin, (req, res) => {
  db.query('SELECT id, nama, email, role, status FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error mengambil data user' });
    if (results.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ user: results[0] });
  });
});

//Proses Update User (Admin)
router.put('/edit/:id', verifyToken, isAdmin, (req, res) => {
  const { nama, email, role, status } = req.body;
  db.query(
    'UPDATE users SET nama=?, email=?, role=?, status=? WHERE id=?',
    [nama, email, role, status, req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal update user' });
      }
      res.json({ message: 'Data pengguna berhasil diperbarui!' });
    }
  );
});

//Hapus user
router.delete('/hapus/:id', verifyToken, isAdmin, (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal menghapus user' });
    }
    res.json({ message: 'User berhasil dihapus.' });
  });
});

//Nonaktifkan User
router.post('/nonaktif/:id', verifyToken, isAdmin, (req, res) => {
  db.query('UPDATE users SET status = "nonaktif" WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menonaktifkan user' });
    res.json({ message: 'User berhasil dinonaktifkan.' });
  });
});

//auto nonaktif user tidak aktif lebih dari 14 hari 
router.post('/auto-nonaktif', verifyToken, isAdmin, (req, res) => {
  db.query('UPDATE users SET status = "nonaktif" WHERE TIMESTAMPDIFF(DAY, last_login, NOW()) > 14', (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menjalankan auto-nonaktif' });
    res.json({ message: 'Berhasil menonaktifkan user yang tidak aktif.' });
  });
});

//proses register
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;
  
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = { nama, email, password: hashedPassword, role: 'user', status: 'aktif' };

      User.register(data, (err) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ message: 'Gagal mendaftar, email mungkin sudah digunakan!' });
        } else {
          return res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
        }
      });
  } catch(err) {
      res.status(500).json({ message: 'Server error' });
  }
});

//proses login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => { 
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Email tidak ditemukan.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Password salah!' });
    }

    // Update last_login dan status aktif
    db.query('UPDATE users SET last_login = NOW(), status = "aktif" WHERE id = ?', [user.id], (err2) => {
      if (err2) console.error('Gagal update last_login:', err2);
    });

    // Generate JWT
    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email, nama: user.nama },
        JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.json({
        message: `Selamat datang kembali, ${user.nama}!`,
        token,
        user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role
        }
    });
  });
});

module.exports = router;

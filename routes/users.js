var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../model/Model_User');
const db = require('../config/db'); // ⬅️ tambah koneksi langsung ke DB
const moment = require('moment');

// Middleware: Cek apakah user adalah admin //
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    req.flash('error', '❌ Anda harus login sebagai admin untuk mengakses halaman ini.');
    res.redirect('/users/login');
  }
};

// 🧾 Halaman Manajemen Users (hanya untuk admin) // 
router.get('/manage', isAdmin, (req, res) => {
  const query = `
    SELECT id, nama, email, role, status, last_login,
    TIMESTAMPDIFF(DAY, last_login, NOW()) AS days_inactive
    FROM users
  `;
  db.query(query, (err, users) => {
    if (err) {
      console.error('Error mengambil data users:', err);
      return res.send('Terjadi kesalahan saat mengambil data user.');
    }

    res.render('users/manage', {
      user: req.session.user,
      users: users,
    });
  });
});

// 🧩 Form Edit User (Admin) // 
router.get('/edit/:id', isAdmin, (req, res) => {
  const id = req.params.id;
  const query = `SELECT id, nama, email, role, status FROM users WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      req.flash('error', '❌ User tidak ditemukan.');
      return res.redirect('/users/manage');
    }

    res.render('users/edit', {
      user: req.session.user,
      data: result[0]
    });
  });
});


// 💾 Proses Update User (Admin) //
router.post('/edit/:id', isAdmin, (req, res) => {
  const { nama, email, role, status } = req.body;
  db.query(
    'UPDATE users SET nama=?, email=?, role=?, status=? WHERE id=?',
    [nama, email, role, status, req.params.id],
    (err) => {
      if (err) throw err;
      req.flash('success', '✅ Data pengguna berhasil diperbarui!');
      res.redirect('/users/manage');
    }
  );
});


// Nonaktifkan user manual (admin) //
router.post('/nonaktif/:id', isAdmin, (req, res) => {
  const id = req.params.id;
  db.query('UPDATE users SET status = "nonaktif" WHERE id = ?', [id], (err) => {
    if (err) throw err;
    req.flash('success', '✅ User berhasil dinonaktifkan.');
    res.redirect('/users/manage');
  });
});


// Auto Nonaktifkan user yang tidak aktif >14 hari //
router.post('/auto-nonaktif', isAdmin, (req, res) => {
  const query = `
    UPDATE users
    SET status = 'nonaktif'
    WHERE TIMESTAMPDIFF(DAY, last_login, NOW()) > 14
      AND role = 'user'
      AND status = 'aktif'
  `;
  db.query(query, (err) => {
    if (err) throw err;
    req.flash('warning', '⚠️ Semua user tidak aktif lebih dari 14 hari telah dinonaktifkan.');
    res.redirect('/users/manage');
  });
});

// ✏️ Edit data user (nama, email, role) // 
router.post('/edit/:id', isAdmin, (req, res) => {
  const { nama, email, role } = req.body;
  db.query('UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?', [nama, email, role, req.params.id], (err) => {
    if (err) throw err;
    req.flash('success', '✅ Data user berhasil diperbarui.');
    res.redirect('/users/manage');
  });
});

// 🗑️ Hapus user // 
router.get('/hapus/:id', isAdmin, (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    req.flash('success', '🗑️ User berhasil dihapus.');
    res.redirect('/users/manage');
  });
});

// ==========================================================
// Halaman Login & Register
// ==========================================================
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/register', (req, res) => {
  res.render('auth/register');
});

// ==========================================================
// Proses Register
// ==========================================================
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const data = { nama, email, password: hashedPassword, role: 'user', status: 'aktif' };

  User.register(data, (err) => {
    if (err) {
      console.error(err);
      req.flash('error', '❌ Gagal mendaftar, email mungkin sudah digunakan!');
      return res.redirect('/users/register');
    } else {
      req.flash('success', '✅ Registrasi berhasil! Silakan login.');
      return res.redirect('/users/login');
    }
  });
});

// Proses Login // 
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => { 
    if (err || results.length === 0) {
      req.flash('error', '❌ Email tidak ditemukan.');
      return res.redirect('/users/login');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      req.flash('error', '❌ Password salah!');
      return res.redirect('/users/login');
    }

    // 🔐 Simpan session user
    req.session.user = user;

    // 🕓 Update last_login dan status aktif
    db.query('UPDATE users SET last_login = NOW(), status = "aktif" WHERE id = ?', [user.id], (err2) => {
      if (err2) console.error('Gagal update last_login:', err2);
    });

    // 🔥 Flash message selamat datang
    req.flash('success', `☕ Selamat datang kembali, ${user.nama}!`);

    // 🔀 Redirect berdasarkan role
    if (user.role === 'admin') {
      res.redirect('/dashboard');
    } else {
      res.redirect('/produk/katalog');
    }
  });
});


// Logout //
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/users/login');
  });
});

module.exports = router;

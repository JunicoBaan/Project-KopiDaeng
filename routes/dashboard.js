const express = require('express');
const router = express.Router();
const db = require('../config/db');
const ExcelJS = require('exceljs');

// Middleware: hanya admin yang boleh akses dashboard
function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('message', 'Akses ditolak. Hanya admin yang dapat melihat dashboard.');
    return res.redirect('/');
  }
  next();
}

// ============================================================
// 🏠 ROUTE UTAMA DASHBOARD ADMIN (Statistik + Laporan Harian)
// ============================================================
router.get('/', isAdmin, (req, res) => {
  const { start, end } = req.query;
  let dataDashboard = {};

  // 📊 Query Laporan Penjualan Harian (bisa difilter tanggal)
  let laporanQuery = `
    SELECT 
      DATE(tanggal_pesanan) AS tanggal,
      COUNT(*) AS jumlah_pesanan,
      SUM(total_harga) AS total_penjualan
    FROM pesanan
    WHERE status_pesanan IN ('Dibayar', 'Selesai')
  `;
  const params = [];

  if (start && end) {
    laporanQuery += ` AND DATE(tanggal_pesanan) BETWEEN ? AND ?`;
    params.push(start, end);
  }

  laporanQuery += ` GROUP BY DATE(tanggal_pesanan) ORDER BY tanggal DESC`;

  // Hitung total produk
  db.query('SELECT COUNT(*) AS totalProduk FROM produk', (err, produk) => {
    if (err) throw err;
    dataDashboard.totalProduk = produk[0].totalProduk;

    // Hitung total user
    db.query('SELECT COUNT(*) AS totalUser FROM users', (err, pengguna) => {
      if (err) throw err;
      dataDashboard.totalUser = pengguna[0].totalUser;

      // Hitung total pesanan
      db.query('SELECT COUNT(*) AS totalPesanan FROM pesanan', (err, pesanan) => {
        if (err && err.code === 'ER_NO_SUCH_TABLE') {
          console.warn('⚠️ Tabel pesanan belum dibuat, lewati...');
          dataDashboard.totalPesanan = 0;
        } else if (err) {
          throw err;
        } else {
          dataDashboard.totalPesanan = pesanan[0].totalPesanan || 0;
        }

        // Hitung total stok semua produk
        db.query('SELECT SUM(stok) AS totalStok FROM produk', (err, stok) => {
          if (err) throw err;
          dataDashboard.totalStok = stok[0].totalStok || 0;

          // Jalankan query laporan harian
          db.query(laporanQuery, params, (err, laporan) => {
            if (err) throw err;

            // ✅ kirim data tambahan "active" agar sidebar tahu menu aktif
            res.render('dashboard/index', {
              title: 'Dashboard Admin - KopiDaeng',
              user: req.session.user,
              data: dataDashboard,
              laporan,
              start: start || '',
              end: end || '',
              message: req.flash('message'),
              active: 'dashboard' // 🟧 <--- penting untuk highlight sidebar
            });
          });
        });
      });
    });
  });
});

// ============================================================
// 📤 EXPORT LAPORAN KE EXCEL
// ============================================================
router.get('/export', isAdmin, async (req, res) => {
  const { start, end } = req.query;

  let exportQuery = `
    SELECT 
      DATE(tanggal_pesanan) AS tanggal,
      COUNT(*) AS jumlah_pesanan,
      SUM(total_harga) AS total_penjualan
    FROM pesanan
    WHERE status_pesanan IN ('Dibayar', 'Selesai')
  `;
  const params = [];

  if (start && end) {
    exportQuery += ` AND DATE(tanggal_pesanan) BETWEEN ? AND ?`;
    params.push(start, end);
  }

  exportQuery += ` GROUP BY DATE(tanggal_pesanan) ORDER BY tanggal DESC`;

  db.query(exportQuery, async (err, results) => {
    if (err) throw err;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Penjualan Harian');

    worksheet.columns = [
      { header: 'Tanggal', key: 'tanggal', width: 20 },
      { header: 'Jumlah Pesanan', key: 'jumlah_pesanan', width: 20 },
      { header: 'Total Penjualan (Rp)', key: 'total_penjualan', width: 25 },
    ];

    results.forEach(row => {
      worksheet.addRow({
        tanggal: new Date(row.tanggal).toLocaleDateString('id-ID'),
        jumlah_pesanan: row.jumlah_pesanan,
        total_penjualan: row.total_penjualan
      });
    });

    // Styling header agar rapi dan profesional
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6D4C41' } // coklat khas KopiDaeng ☕
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="laporan_penjualan_harian.xlsx"'
    );
    await workbook.xlsx.write(res);
    res.end();
  });
});

module.exports = router;

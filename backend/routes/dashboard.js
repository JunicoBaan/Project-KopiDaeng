const express = require('express');
const router = express.Router();
const db = require('../config/db');
const ExcelJS = require('exceljs');
const { verifyToken, isAdmin } = require('../middleware/auth');

// ============================================================
// 🏠 ROUTE UTAMA DASHBOARD ADMIN (Statistik + Laporan Harian)
// ============================================================
router.get('/', verifyToken, isAdmin, (req, res) => {
  const { start, end } = req.query;
  let dataDashboard = {};

  // 📊 Query Laporan Penjualan Harian
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
    if (err) return res.status(500).json({ message: 'Error fetching dashboard data' });
    dataDashboard.totalProduk = produk[0].totalProduk;

    // Hitung total user
    db.query('SELECT COUNT(*) AS totalUser FROM users', (err, pengguna) => {
      if (err) return res.status(500).json({ message: 'Error fetching dashboard data' });
      dataDashboard.totalUser = pengguna[0].totalUser;

      // Hitung total pesanan
      db.query('SELECT COUNT(*) AS totalPesanan FROM pesanan', (err, pesanan) => {
        if (err && err.code === 'ER_NO_SUCH_TABLE') {
          dataDashboard.totalPesanan = 0;
        } else if (err) {
          return res.status(500).json({ message: 'Error fetching dashboard data' });
        } else {
          dataDashboard.totalPesanan = pesanan[0].totalPesanan || 0;
        }

        // Hitung total stok semua produk
        db.query('SELECT SUM(stok) AS totalStok FROM produk', (err, stok) => {
          if (err) return res.status(500).json({ message: 'Error fetching dashboard data' });
          dataDashboard.totalStok = stok[0].totalStok || 0;

          // Jalankan query laporan harian
          db.query(laporanQuery, params, (err, laporan) => {
            if (err) return res.status(500).json({ message: 'Error fetching dashboard data' });

            res.json({
              data: dataDashboard,
              laporan,
              start: start || '',
              end: end || ''
            });
          });
        });
      });
    });
  });
});

//export laporan ke excel
router.get('/export', verifyToken, isAdmin, async (req, res) => {
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
    if (err) return res.status(500).json({ message: 'Error exporting report' });

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

    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6D4C41' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="laporan_penjualan_harian.xlsx"'
    );
    await workbook.xlsx.write(res);
    res.end();
  });
});

module.exports = router;

const db = require('./config/db');

const query = `
  ALTER TABLE pesanan 
  MODIFY COLUMN status_pesanan ENUM(
    'Menunggu Pembayaran',
    'Menunggu Verifikasi',
    'Dibayar',
    'Diproses',
    'Dikirim',
    'Selesai',
    'Dibatalkan'
  ) NOT NULL DEFAULT 'Menunggu Pembayaran'
`;

db.query(query, (err, result) => {
  if (err) {
    console.error('Migration failed:', err);
  } else {
    console.log('Migration succeeded:', result);
  }
  process.exit(0);
});

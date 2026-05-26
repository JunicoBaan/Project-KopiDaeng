const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

// ====== IMPORT ROUTES ======
const usersRouter = require('./routes/users');
const produkRouter = require('./routes/produk');
const dashboardRouter = require('./routes/dashboard');
const pesananRouter = require('./routes/pesanan');
const pembayaranRouter = require('./routes/pembayaran');
const pengirimanRouter = require('./routes/pengiriman');

const app = express();

// ====== MIDDLEWARE ======
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static folder untuk uploads gambar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== ROUTING ======
app.use('/api/users', usersRouter);
app.use('/api/produk', produkRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/pesanan', pesananRouter);
app.use('/api/pembayaran', pembayaranRouter);
app.use('/api/pengiriman', pengirimanRouter);

// ====== ERROR HANDLER ======
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error' 
  });
});

module.exports = app;

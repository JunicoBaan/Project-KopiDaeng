// ====== IMPORT MODULE ======
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var dotenv = require('dotenv');

// ====== ROUTES ======
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var produkRouter = require('./routes/produk'); // sprint 2
var dashboardRouter = require('./routes/dashboard');
var pesananRouter = require('./routes/pesanan'); // sprint 3
var pengirimanRouter = require('./routes/pengiriman');
var ulasanRouter = require('./routes/ulasan');
var pelangganRouter = require('./routes/pelanggan');


// ====== CONFIGURASI ======
dotenv.config();
var app = express();

// ====== VIEW ENGINE SETUP ======
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ====== MIDDLEWARE ======
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads'));


// ====== SESSION & FLASH ======
app.use(
  session({
    secret: 'kopidaengsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 jam
  })
);
app.use(flash());

// ====== GLOBAL VARIABLES UNTUK FLASH MESSAGE ======
app.use(function (req, res, next) {
  // 🔹 variabel global yang bisa diakses dari semua EJS
  res.locals.success = req.flash('success'); // pesan sukses (login berhasil, register sukses, dll)
  res.locals.error = req.flash('error');     // pesan error (password salah, email sudah digunakan, dll)
  res.locals.message = req.flash('message'); // fallback untuk pesan lama
  res.locals.user = req.session.user || null;
  next();
});

// ====== ROUTING ======
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/produk', produkRouter);
app.use('/dashboard', dashboardRouter);
app.use('/pesanan', pesananRouter);
app.use('/pengiriman', pengirimanRouter);
app.use('/pembayaran', require('./routes/pembayaran'));
app.use('/ulasan', ulasanRouter);
app.use('/', pelangganRouter);


// ====== ERROR HANDLER ======
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var express = require('express');
var router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query("SELECT * FROM produk ORDER BY RAND() LIMIT 4", (err, produkBest) => {
    if (err) throw err;

    res.render('home', {
      user: req.session.user,
      produkBest: produkBest
    });
  });
});


module.exports = router;

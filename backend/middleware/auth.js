const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kopidaengsecret_jwt';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"
  if (!token) {
    return res.status(403).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized, token invalid or expired' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.user = decoded; // simpan seluruh data user hasil decode
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.userRole === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak, hanya untuk admin' });
  }
}

function isUser(req, res, next) {
  if (req.userRole === 'user' || req.userRole === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak, silakan login' });
  }
}

module.exports = {
  verifyToken,
  isAdmin,
  isUser,
  JWT_SECRET
};

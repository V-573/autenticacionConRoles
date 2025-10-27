// src/middleware/auth.js
const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_aqui';
const JWT_SECRET = 'tu_clave_secreta_super_segura_aqui'; // Cambiar en producción

// Verificar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

// Verificar rol de admin
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de admin' });
  }
  next();
}

// Verificar rol VIP o admin
function requireVIP(req, res, next) {
  if (req.user.role !== 'vip' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Contenido exclusivo para usuarios VIP' });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireVIP,
};
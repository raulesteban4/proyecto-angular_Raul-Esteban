const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave_super_secreta'; // process.env.SECRET-KEY


const getTokenFromRequest = (req) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return req.cookies?.token;
};

const authMiddleware = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ message: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuarioId = decoded.id;
    req.usuarioPerfil = decoded.perfil || decoded.role || 'user';
    req.usuarioEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.usuarioPerfil) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  if (!roles.includes(req.usuarioPerfil)) {
    return res.status(403).json({ message: 'No autorizado' });
  }
  next();
};

module.exports = { authMiddleware, requireRole };

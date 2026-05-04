const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave_super_secreta'; // process.env.SECRET-KEY

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // la cookie donde guardamos el JWT

  if (!token) return res.status(401).json({ message: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuarioId = decoded.id; // guardamos info del usuario
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
module.exports = authMiddleware;

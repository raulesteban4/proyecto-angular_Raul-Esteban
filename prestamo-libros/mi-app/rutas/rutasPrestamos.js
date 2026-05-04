const express = require('express');
const router = express.Router();
const controladorPrestamos = require('../controladores/controladorPrestamos.js');
const { authMiddleware, requireRole } = require('../utils/authMiddleware2.js');
const { validarPrestamo } = require('../utils/validatePrestamos.js');

router.get('/', authMiddleware, controladorPrestamos.getPrestamos);
router.get('/:id', authMiddleware, controladorPrestamos.getPrestamo);
router.post('/', authMiddleware, requireRole('admin'), validarPrestamo, controladorPrestamos.crearPrestamo);
router.put('/:id', authMiddleware, requireRole('admin'), controladorPrestamos.actualizarPrestamo);
router.delete('/:id', authMiddleware, requireRole('admin'), controladorPrestamos.eliminarPrestamo);

module.exports = router;

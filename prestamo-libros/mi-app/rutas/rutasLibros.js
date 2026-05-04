const express = require('express');
const router = express.Router();
const controladorLibros = require('../controladores/controladorLibros.js');
const { authMiddleware, requireRole } = require('../utils/authMiddleware2.js');
const { validarLibro } = require('../utils/validateLibros.js');

router.get('/', authMiddleware, controladorLibros.getLibros);
router.get('/:id', authMiddleware, controladorLibros.getLibro);
router.post('/', authMiddleware, requireRole('admin'), validarLibro, controladorLibros.crearLibro);
router.put('/:id', authMiddleware, requireRole('admin'), validarLibro, controladorLibros.actualizarLibro);
router.delete('/:id', authMiddleware, requireRole('admin'), controladorLibros.eliminarLibro);

module.exports = router;

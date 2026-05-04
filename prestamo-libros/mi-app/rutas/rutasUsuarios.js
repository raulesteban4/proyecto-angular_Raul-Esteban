const express = require('express');
const router = express.Router();
const ControladorUsuarios = require('../controladores/controladorUsuarios.js');
const { authMiddleware, requireRole } = require('../utils/authMiddleware2.js');
const { validarRegistro, validarLogin, validarUsuarioActualizacion } = require('../utils/validateUsuarios.js');

router.post('/registro', [validarRegistro, ControladorUsuarios.usuarioRegistro]);
router.post('/login', ControladorUsuarios.usuarioLogin);
router.post('/logout', ControladorUsuarios.usuarioLogout);
router.get('/perfil', authMiddleware, ControladorUsuarios.getPerfil);

router.get('/', authMiddleware, requireRole('admin'), ControladorUsuarios.getUsuarios);
router.get('/:id', authMiddleware, ControladorUsuarios.getUsuario);
router.put('/:id', authMiddleware, validarUsuarioActualizacion, ControladorUsuarios.actualizarUsuario);
router.delete('/:id', authMiddleware, requireRole('admin'), ControladorUsuarios.eliminarUsuario);

module.exports = router;
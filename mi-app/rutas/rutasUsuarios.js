const express = require('express');
const router = express.Router();
//const ControladorUsuarios = require('../controladores/controladorUsuarios.js');
const ControladorUsuarios = require('../controladores/controladorUsuarios2.js');
//const ControladorUsuarios = require('../controladores/controladorUsuarios3.js');
//const authMiddleware= require('../utils/authMiddleware.js');
const authMiddleware= require('../utils/authMiddleware2.js');
//const authMiddleware= require('../utils/authMiddleware3.js');
const { validarRegistro, validarLogin } = require('../utils/validateUsuarios.js');

router.post('/registro', [validarRegistro, ControladorUsuarios.usuarioRegistro]);
router.post('/login', ControladorUsuarios.usuarioLogin);
router.post('/logout', ControladorUsuarios.usuarioLogout);
router.get('/perfil', authMiddleware, ControladorUsuarios.getPerfil);

module.exports = router;
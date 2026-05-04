const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger.js');
const Usuario = require('../modelos/Usuario');
const { validationResult } = require('express-validator');

const SECRET_KEY = 'clave_super_secreta'; // En producción usar variable de entorno

const usuarioRegistro = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const userIP = req.ip;
  const method = req.method;
  const url = req.originalUrl;

  try {
    const { codigo, email, clave, nombre } = req.body;

    const existingUser = await Usuario.findOne({ $or: [{ codigo }, { email }] });
    if (existingUser) {
      logger.info(`${userIP} - - "${method} ${url}" REGISTRO: Usuario existente`);
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(clave, 10);
    const user = new Usuario({ codigo, email, nombre, clave: hashedPassword, perfil: 'user' });
    await user.save();

    logger.info(`${userIP} - - "${method} ${url}" REGISTRO: Usuario registrado`);
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    logger.error(`${userIP} - - "${method} ${url}" REGISTRO: error ${error}`);
    res.status(500).json({ message: 'Error en el registro', error });
  }
};

const usuarioLogin = async (req, res) => {
  const userIP = req.ip;
  const method = req.method;
  const url = req.originalUrl;

  try {
    const { codigo, clave } = req.body;

    const user = await Usuario.findOne({ codigo });
    if (!user) {
      logger.info(`${userIP} - - "${method} ${url}" LOGIN: usuario ${codigo} no encontrado`);
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(clave, user.clave);
    if (!isMatch) {
      logger.info(`${userIP} - - "${method} ${url}" LOGIN: usuario/clave incorrecta`);
      return res.status(400).json({ message: 'Usuario/clave incorrecta' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, perfil: user.perfil }, SECRET_KEY, { expiresIn: '1h' });
    logger.info(`${userIP} - - "${method} ${url}" LOGIN: login correcto`);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
      maxAge: 60 * 60 * 1000
    });
    res.json({
      message: 'Login correcto',
      token,
      usuario: {
        codigo: user.codigo,
        nombre: user.nombre,
        email: user.email,
        perfil: user.perfil
      }
    });
  } catch (error) {
    logger.error(`${userIP} - - "${method} ${url}" LOGIN: error ${error}`);
    res.status(500).json({ message: 'Error en el login', error });
  }
};

const usuarioLogout = (req, res) => {
  const userIP = req.ip;
  const method = req.method;
  const url = req.originalUrl;
  logger.info(`${userIP} - - "${method} ${url}" LOGOUT: cierre de sesión`);
  res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: false });
  res.json({ message: 'Logout correcto' });
};

const getPerfil = async (req, res) => {
  const userIP = req.ip;
  const method = req.method;
  const url = req.originalUrl;

  try {
    const user = await Usuario.findById(req.usuarioId).select('-clave');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    logger.info(`${userIP} - - "${method} ${url}" PERFIL: petición realizada`);
    res.json({ message: 'Perfil del usuario', user });
  } catch (error) {
    logger.error(`${userIP} - - "${method} ${url}" PERFIL: error ${error}`);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const getUsuarios = async (req, res) => {
  try {
    if (req.usuarioPerfil !== 'admin') return res.status(403).json({ message: 'No autorizado' });
    const usuarios = await Usuario.find().select('-clave');
    res.status(200).json(usuarios);
  } catch (error) {
    logger.error(`Error obtener usuarios: ${error}`);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

const getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-clave');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (req.usuarioPerfil !== 'admin' && req.usuarioId !== req.params.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    logger.error(`Error obtener usuario: ${error}`);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

const actualizarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  try {
    if (req.usuarioPerfil !== 'admin' && req.usuarioId !== req.params.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const updates = { ...req.body };
    if (updates.clave) {
      updates.clave = await bcrypt.hash(updates.clave, 10);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-clave');

    if (!usuarioActualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    logger.error(`Error actualizar usuario: ${error}`);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    if (req.usuarioPerfil !== 'admin') return res.status(403).json({ message: 'No autorizado' });

    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    logger.error(`Error eliminar usuario: ${error}`);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  usuarioLogin,
  usuarioLogout,
  usuarioRegistro,
  getPerfil,
  getUsuarios,
  getUsuario,
  actualizarUsuario,
  eliminarUsuario
};
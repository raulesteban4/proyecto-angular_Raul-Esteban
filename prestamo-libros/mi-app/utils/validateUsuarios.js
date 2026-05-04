const { body } = require('express-validator');

const validarRegistro = [
  body('codigo')
    .trim()
    .notEmpty().withMessage('El codigo es obligatorio')
    .isLength({ min: 3 }).withMessage('El codigo debe tener al menos 3 caracteres')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('clave')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .escape(),
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
    .escape()
];

const validarLogin = [
  body('codigo')
    .trim()
    .notEmpty().withMessage('El codigo es obligatorio')
    .isLength({ min: 3 }).withMessage('El codigo debe tener al menos 3 caracteres')
    .escape(),
  body('clave')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .escape(),
];

const validarUsuarioActualizacion = [
  body('codigo')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('El codigo debe tener al menos 3 caracteres')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('clave')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .escape(),
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
    .escape(),
  body('perfil')
    .optional()
    .trim()
    .isIn(['user', 'admin']).withMessage('El perfil debe ser user o admin'),
  body('estado')
    .optional()
    .trim()
    .escape()
];

module.exports = { validarLogin, validarRegistro, validarUsuarioActualizacion };
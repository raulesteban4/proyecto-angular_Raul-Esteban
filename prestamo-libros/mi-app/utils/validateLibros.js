const { body } = require('express-validator');

const validarLibro = [
  body('titulo')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 2 }).withMessage('El título debe tener al menos 2 caracteres')
    .escape(),
  body('autor')
    .trim()
    .notEmpty().withMessage('El autor es obligatorio')
    .isLength({ min: 2 }).withMessage('El autor debe tener al menos 2 caracteres')
    .escape(),
  body('genero')
    .optional()
    .trim()
    .escape(),
  body('anioPublicacion')
    .optional()
    .isInt({ min: 0 }).withMessage('El año de publicación debe ser un número válido'),
  body('disponible')
    .optional()
    .customSanitizer(value => {
      if (typeof value === 'string') {
        return value === 'true';
      }
      return value;
    })
    .isBoolean().withMessage('El valor de disponible debe ser booleano'),
  body('portada')
    .optional({ checkFalsy: true })
    .trim()
    .isString().withMessage('La portada debe ser texto')
    .escape(),
  body('resumen')
    .optional()
    .trim()
    .escape()
];

module.exports = { validarLibro };

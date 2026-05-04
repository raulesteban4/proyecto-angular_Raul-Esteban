const { body } = require('express-validator');

const validarPrestamo = [
  body('libroId')
    .trim()
    .notEmpty().withMessage('El identificador del libro es obligatorio')
    .isMongoId().withMessage('El identificador del libro no es válido'),
  body('fechaDevolucion')
    .trim()
    .notEmpty().withMessage('La fecha de devolución es obligatoria')
    .isISO8601().withMessage('La fecha de devolución debe tener un formato válido')
    .toDate(),
  body('devuelto')
    .optional()
    .isBoolean().withMessage('El valor de devuelto debe ser booleano')
];

module.exports = { validarPrestamo };

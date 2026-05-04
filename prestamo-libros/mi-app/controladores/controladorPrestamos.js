const { validationResult } = require('express-validator');
const logger = require('../utils/logger.js');
const Prestamo = require('../modelos/Prestamo.js');
const Libro = require('../modelos/Libro.js');

async function getPrestamos(req, res) {
  try {
    let query = {};
    if (req.usuarioPerfil !== 'admin') {
      query.usuario = req.usuarioId;
    }

    const prestamos = await Prestamo.find(query)
      .populate('libro')
      .populate('usuario', 'codigo nombre email perfil');

    res.status(200).json(prestamos);
  } catch (error) {
    logger.error(`Error obtener préstamos: ${error}`);
    res.status(500).json({ message: 'Error al obtener los préstamos' });
  }
}

async function getPrestamo(req, res) {
  try {
    const prestamo = await Prestamo.findById(req.params.id)
      .populate('libro')
      .populate('usuario', 'codigo nombre email perfil');

    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
    if (req.usuarioPerfil !== 'admin' && prestamo.usuario._id.toString() !== req.usuarioId) {
      return res.status(403).json({ message: 'No autorizado para ver este préstamo' });
    }

    res.status(200).json(prestamo);
  } catch (error) {
    logger.error(`Error obtener préstamo: ${error}`);
    res.status(500).json({ message: 'Error al obtener el préstamo' });
  }
}

async function crearPrestamo(req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { libroId, fechaDevolucion } = req.body;

    const libro = await Libro.findById(libroId);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    if (!libro.disponible) return res.status(400).json({ message: 'El libro no está disponible' });

    const prestamo = new Prestamo({
      libro: libro._id,
      usuario: req.usuarioId,
      fechaPrestamo: new Date(),
      fechaDevolucion,
      devuelto: false
    });

    libro.disponible = false;
    await Promise.all([prestamo.save(), libro.save()]);

    const prestamoCreado = await Prestamo.findById(prestamo._id)
      .populate('libro')
      .populate('usuario', 'codigo nombre email perfil');

    res.status(201).json(prestamoCreado);
  } catch (error) {
    logger.error(`Error crear préstamo: ${error}`);
    res.status(500).json({ message: 'Error al crear el préstamo' });
  }
}

async function actualizarPrestamo(req, res) {
  try {
    const prestamo = await Prestamo.findById(req.params.id);
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });

    if (req.usuarioPerfil !== 'admin' && prestamo.usuario.toString() !== req.usuarioId) {
      return res.status(403).json({ message: 'No autorizado para modificar este préstamo' });
    }

    const { fechaDevolucion, devuelto } = req.body;

    if (fechaDevolucion) prestamo.fechaDevolucion = fechaDevolucion;
    if (typeof devuelto === 'boolean') {
      if (devuelto && !prestamo.devuelto) {
        const libro = await Libro.findById(prestamo.libro);
        if (libro) {
          libro.disponible = true;
          await libro.save();
        }
      }
      if (!devuelto && prestamo.devuelto) {
        const libro = await Libro.findById(prestamo.libro);
        if (libro) {
          libro.disponible = false;
          await libro.save();
        }
      }
      prestamo.devuelto = devuelto;
    }

    await prestamo.save();

    const prestamoActualizado = await Prestamo.findById(prestamo._id)
      .populate('libro')
      .populate('usuario', 'codigo nombre email perfil');

    res.status(200).json(prestamoActualizado);
  } catch (error) {
    logger.error(`Error actualizar préstamo: ${error}`);
    res.status(500).json({ message: 'Error al actualizar el préstamo' });
  }
}

async function eliminarPrestamo(req, res) {
  try {
    const prestamo = await Prestamo.findById(req.params.id);
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });

    const libro = await Libro.findById(prestamo.libro);
    if (libro && !prestamo.devuelto) {
      libro.disponible = true;
      await libro.save();
    }

    await prestamo.deleteOne();

    res.status(200).json({ message: 'Préstamo eliminado correctamente' });
  } catch (error) {
    logger.error(`Error eliminar préstamo: ${error}`);
    res.status(500).json({ message: 'Error al eliminar el préstamo' });
  }
}

module.exports = { getPrestamos, getPrestamo, crearPrestamo, actualizarPrestamo, eliminarPrestamo };
const { validationResult } = require('express-validator');
const logger = require('../utils/logger.js');
const Libro = require('../modelos/Libro.js');

async function getLibros(req, res) {
  try {
    const libros = await Libro.find().sort({ titulo: 1 });
    res.status(200).json(libros);
  } catch (error) {
    logger.error(`Error obtener libros: ${error}`);
    res.status(500).json({ message: 'Error al obtener los libros' });
  }
}

async function getLibro(req, res) {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    res.status(200).json(libro);
  } catch (error) {
    logger.error(`Error obtener libro: ${error}`);
    res.status(500).json({ message: 'Error al obtener el libro' });
  }
}

async function crearLibro(req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { titulo, autor, genero, anioPublicacion, disponible, portada, resumen } = req.body;
    const libro = new Libro({ titulo, autor, genero, anioPublicacion, disponible, portada, resumen });
    await libro.save();
    res.status(201).json(libro);
  } catch (error) {
    logger.error(`Error crear libro: ${error}`);
    res.status(500).json({ message: 'Error al crear el libro' });
  }
}

async function actualizarLibro(req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const errorArray = errores.array();
    logger.error(`Validación actualizar libro fallida: ${JSON.stringify(errorArray)}`);
    return res.status(400).json({ errores: errorArray, message: 'Datos del libro inválidos' });
  }

  try {
    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!libroActualizado) return res.status(404).json({ message: 'Libro no encontrado' });
    res.status(200).json(libroActualizado);
  } catch (error) {
    logger.error(`Error actualizar libro: ${error}`);
    res.status(500).json({ message: 'Error al actualizar el libro' });
  }
}

async function eliminarLibro(req, res) {
  try {
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);
    if (!libroEliminado) return res.status(404).json({ message: 'Libro no encontrado' });
    res.status(200).json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    logger.error(`Error eliminar libro: ${error}`);
    res.status(500).json({ message: 'Error al eliminar el libro' });
  }
}

module.exports = { getLibros, getLibro, crearLibro, actualizarLibro, eliminarLibro };
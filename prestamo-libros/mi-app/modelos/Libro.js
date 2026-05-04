const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  legacyId: { type: Number, index: true, unique: true, sparse: true },
  titulo: { type: String, required: true, trim: true },
  autor: { type: String, required: true, trim: true },
  genero: { type: String, trim: true, default: '' },
  anioPublicacion: { type: Number, min: 0 },
  disponible: { type: Boolean, default: true },
  portada: { type: String, trim: true, default: '' },
  resumen: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Libro', libroSchema);

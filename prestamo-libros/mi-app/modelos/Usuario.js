const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  clave: { type: String, required: true },
  nombre: { type: String, required: true, trim: true },
  perfil: { type: String, enum: ['user', 'admin'], default: 'user' },
  estado: { type: String, default: 'Activo', trim: true },
  fechaUltimoAcceso: { type: Date, default: Date.now },
  numeroAccesosErroneo: { type: Number, default: 0 }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Libro = require('./modelos/Libro');
const Usuario = require('./modelos/Usuario');
const Prestamo = require('./modelos/Prestamo');

const MONGOURL = 'mongodb://root:example@localhost:27017/prestamos?authSource=admin';

const publicDir = path.join(__dirname, '..', 'public');
const librosFile = path.join(publicDir, 'libros.json');
const prestamosFile = path.join(publicDir, 'prestamos.json');

async function normalizeCodigo(nombre) {
  return nombre
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20) + '_' + Math.floor(Math.random() * 10000);
}

async function createPlaceholderUsuario(nombre) {
  const codigo = await normalizeCodigo(nombre);
  const email = `${codigo}@example.com`;
  const clave = await bcrypt.hash('usuario123', 10);

  const usuario = new Usuario({
    codigo,
    email,
    nombre,
    clave,
    perfil: 'user'
  });
  await usuario.save();
  return usuario;
}

async function findOrCreateUsuario(nombre) {
  if (!nombre) return null;
  let usuario = await Usuario.findOne({ nombre: nombre });
  if (!usuario) {
    usuario = await createPlaceholderUsuario(nombre);
    console.log(`Usuario creado de prueba: ${usuario.nombre} (${usuario.codigo})`);
  }
  return usuario;
}

async function importLibros() {
  const documentos = JSON.parse(fs.readFileSync(librosFile, 'utf8'));
  await Libro.deleteMany({});
  const saved = await Libro.insertMany(documentos.map(doc => ({
    legacyId: doc.id,
    titulo: doc.titulo,
    autor: doc.autor,
    genero: doc.genero,
    anioPublicacion: doc.anioPublicacion,
    disponible: typeof doc.disponible === 'boolean' ? doc.disponible : true,
    portada: doc.portada,
    resumen: doc.resumen || ''
  })));
  console.log(`Importados ${saved.length} libros.`);
  return saved;
}

async function importPrestamos(libros) {
  const documentos = JSON.parse(fs.readFileSync(prestamosFile, 'utf8'));
  await Prestamo.deleteMany({});

  const libroMap = new Map(libros.map(libro => [String(libro.legacyId || libro.id || libro._id), libro]));
  let imported = 0;

  for (const doc of documentos) {
    const libroId = doc.libro?.id;
    const libro = libroMap.get(String(libroId));
    if (!libro) {
      console.warn(`No se encontró libro con id ${libroId} para el préstamo de ${doc.usuario}`);
      continue;
    }

    const usuario = await findOrCreateUsuario(doc.usuario);
    if (!usuario) continue;

    const prestamo = new Prestamo({
      libro: libro._id,
      usuario: usuario._id,
      fechaPrestamo: doc.fechaPrestamo ? new Date(doc.fechaPrestamo) : new Date(),
      fechaDevolucion: doc.fechaDevolucion ? new Date(doc.fechaDevolucion) : new Date(),
      devuelto: !!doc.devuelto
    });
    await prestamo.save();
    imported += 1;

    if (!prestamo.devuelto && libro.disponible) {
      libro.disponible = false;
      await libro.save();
    }
  }

  console.log(`Importados ${imported} préstamos.`);
}

async function createAdminUser() {
  const adminEmail = 'admin@example.com';
  let admin = await Usuario.findOne({ email: adminEmail });

  if (admin) {
    console.log('Usuario admin ya existe.');
    return admin;
  }

  const clave = await bcrypt.hash('admin123', 10);
  admin = new Usuario({
    codigo: 'admin',
    email: adminEmail,
    nombre: 'Administrador',
    clave,
    perfil: 'admin'
  });
  await admin.save();
  console.log('Usuario admin creado: admin@example.com / admin123');
  return admin;
}

async function main() {
  try {
    await mongoose.connect(MONGOURL);

    console.log('Conectado a MongoDB.');
    await createAdminUser();
    const libros = await importLibros();
    await importPrestamos(libros);
    console.log('Importación completada.');
  } catch (error) {
    console.error('Error al importar datos:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();

const mongoose = require('mongoose');
const Usuario = require('./modelos/Usuario');

const MONGOURL = 'mongodb://root:example@localhost:27017/prestamos?authSource=admin';

async function checkAdmin() {
  try {
    await mongoose.connect(MONGOURL);
    console.log('Conectado a MongoDB.');

    const admin = await Usuario.findOne({ email: 'admin@example.com' });
    console.log('Usuario admin:', admin);

    const allUsers = await Usuario.find({}).select('codigo email nombre perfil');
    console.log('\nTodos los usuarios:');
    allUsers.forEach(u => console.log(`  ${u.codigo} (${u.email}) - perfil: ${u.perfil}`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkAdmin();

const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const login = await fetch('http://localhost:3000/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: 'admin', clave: 'admin123' })
    });
    const authData = await login.json();
    console.log('login status', login.status, authData.message);

    const token = authData.token;

    const libro = {
      titulo: 'Prueba admin',
      autor: 'Admin Tester',
      genero: 'Test',
      anioPublicacion: 2026,
      disponible: true,
      portada: '',
      resumen: 'Libro de prueba admin'
    };

    const resp = await fetch('http://localhost:3000/libros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(libro)
    });
    console.log('create status', resp.status);
    const body = await resp.text();
    console.log(body);
  } catch (e) {
    console.error('error', e);
  }
})();

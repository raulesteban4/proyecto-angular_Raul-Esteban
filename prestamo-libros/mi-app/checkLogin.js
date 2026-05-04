const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const resp = await fetch('http://localhost:3000/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: 'admin', clave: 'admin123' })
    });
    console.log('status', resp.status);
    const body = await resp.text();
    console.log(body);
  } catch (e) {
    console.error('error', e);
  }
})();

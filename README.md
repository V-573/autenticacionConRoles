Este es un ejercicio para entender el funcionamiento de autenticacion. 
Se trabaja con la base de datos que tengo en mongoDb con el usuario vaj573cali@gmail.com
Usuario admin del ejercicio creado es: admin@biblioteca.com y clave: admin123
El primer paso que se esta haciendo para pasar descomponer el archivo server que contiene todo el codigo del backend es crear el archivo dentro de la carpeta router: src/routes/index.js, este archivo es simplemente una prueba para ver que la nueva ruta creada es funcional. 
contenido del archivo: 

// src/routes/index.js
const express = require('express');
const router = express.Router();

// Endpoint de salud para verificar el enrutador
router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'api', timestamp: new Date().toISOString() });
});

module.exports = router;

y en el archivo del backend despues de crear app se llama a la ruta asi: 


// Montar router principal de API
const apiRouter = require('./src/routes'); // resuelve a src/routes/index.js
app.use('/api', apiRouter); //monto el router en la ruta /api

Lo anterior es la prueba funcional de la ruta sin problemas, ahora el siguiente paso es pasar las rutas funcionales de usuario y libros.

Paso2: Crearás src/routes/auth.routes.js con tres endpoints: register, login y profile. Lo montare en index.js bajo auth/
Comentarás temporalmente las rutas originales en server.js para evitar duplicados.
Probarás los endpoints.


paso 3: 
Centralizar middlewares: crear src/middleware/auth.js con authenticateToken, requireAdmin, requireVIP.
Crear router de usuarios: src/routes/users.routes.js con las 4 rutas de gestión de usuarios.
Montar el router en index.js.
Desactivar rutas duplicadas en server.js.
Probar los endpoints.
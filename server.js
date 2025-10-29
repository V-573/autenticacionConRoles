require('dotenv').config();
// server.js - Backend con Node.js, Express y MongoDB
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Importar modelos
//require('./src/models'); // Esto registra User y Book en mongoose
// Importar modelos de forma explícita si es necesario:
 const User = require('./src/models/User');
 const Book = require('./src/models/Book');

// Importar middlewares centralizados
const { authenticateToken, requireAdmin } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
//const JWT_SECRET = 'tu_clave_secreta_super_segura_aqui'; // Cambiar en producción



// Middleware
app.use(cors());
app.use(express.json());



// Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));


// Montar router principal de API
const apiRouter = require('./src/routes'); // resuelve a src/routes/index.js
app.use('/api', apiRouter); //monto el router en la ruta /api

// Conexión a MongoDB
connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Base de datos: MongoDB - biblioteca`);
  console.log(`\n📝 Para crear el admin inicial, ejecuta:`);
  // console.log(`   POST http://localhost:${PORT}/api/init/admin`);
    console.log(`   npm run create-admin`);
});
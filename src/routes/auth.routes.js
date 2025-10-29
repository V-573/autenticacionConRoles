// src/routes/auth.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();

// Importar middlewares centralizados
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');


// IMPORTANTE: usamos el mismo secreto por compatibilidad.
// Idealmente vendrá de process.env.JWT_SECRET.
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_aqui';

// Obtenemos el modelo ya registrado por server.js
// (server.js define mongoose.model('User', userSchema) antes de montar routers)
const User = () => mongoose.model('User');

// Middleware local para este router: validar token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Token inválido' });
//     req.user = user;
//     next();
//   });
// }



// POST /api/auth/register

router.post('/register', authController.register);


// POST /api/auth/register

// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'Todos los campos son requeridos' });
//     }

//     const existingUser = await User().findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ error: 'El usuario o email ya existe' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new (User())({
//       username,
//       email,
//       password: hashedPassword,
//       role: role || 'free',
//     });

//     await user.save();

//     res.status(201).json({
//       message: 'Usuario registrado exitosamente',
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al registrar usuario: ' + error.message });
//   }
// });



// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User().findOne({ email });
//     if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

//     const token = jwt.sign(
//       { id: user._id, username: user.username, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       message: 'Login exitoso',
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al iniciar sesión: ' + error.message });
//   }
// });

// GET /api/auth/profile
router.get('/profile', authenticateToken, authController.getProfile);


// GET /api/auth/profile
// router.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User().findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener perfil' });
//   }
// });

module.exports = router;
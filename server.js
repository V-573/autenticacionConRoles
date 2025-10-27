// server.js - Backend con Node.js, Express y MongoDB
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// Importar modelos
//require('./src/models'); // Esto registra User y Book en mongoose
// Importar modelos de forma explícita si es necesario:
 const User = require('./src/models/User');
 const Book = require('./src/models/Book');

// Importar middlewares centralizados
const { authenticateToken, requireAdmin } = require('./src/middleware/auth');

const app = express();
const PORT = 3000;
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
//mongoose.connect('mongodb://localhost:27017/biblioteca', {
mongoose.connect('mongodb+srv://vaj573cali:abc54321@cluster0.7xbo2v1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// ==================== SCHEMAS Y MODELOS ====================



// Schema de Usuario
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ['admin', 'vip', 'free'], 
//     default: 'free' 
//   },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);

// Schema de Libro
// const bookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   author: { type: String, required: true },
//   description: { type: String },
//   year: { type: Number },
//   genre: { type: String },
//   isExclusive: { type: Boolean, default: false }, // Solo para VIP
//   coverUrl: { type: String },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   createdAt: { type: Date, default: Date.now }
// });

// const Book = mongoose.model('Book', bookSchema);

// ==================== MIDDLEWARE DE AUTENTICACIÓN ====================

// Verificar token JWT
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Token no proporcionado' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Token inválido' });
//     }
//     req.user = user;
//     next();
//   });
// };

// Verificar rol de admin
// const requireAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de admin' });
//   }
//   next();
// };

// Verificar rol VIP o admin
// const requireVIP = (req, res, next) => {
//   if (req.user.role !== 'vip' && req.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Acceso denegado. Contenido exclusivo para usuarios VIP' });
//   }
//   next();
// };

// ==================== RUTAS DE AUTENTICACIÓN ====================


//Esto se elimina porque se pasa al archivo auth.routes.js de la ruta src/routes/auth.routes.js
// REGISTRO de usuario
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     // Validaciones
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'Todos los campos son requeridos' });
//     }

//     // Verificar si el usuario ya existe
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ error: 'El usuario o email ya existe' });
//     }

//     // Encriptar contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Crear usuario (por defecto será 'free')
//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: role || 'free'
//     });

//     await user.save();

//     res.status(201).json({ 
//       message: 'Usuario registrado exitosamente',
//       user: { 
//         id: user._id, 
//         username: user.username, 
//         email: user.email, 
//         role: user.role 
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al registrar usuario: ' + error.message });
//   }
// });

// LOGIN de usuario
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Buscar usuario
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: 'Credenciales inválidas' });
//     }

//     // Verificar contraseña
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Credenciales inválidas' });
//     }

//     // Generar token JWT
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
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al iniciar sesión: ' + error.message });
//   }
// });

// Obtener perfil del usuario autenticado
// app.get('/api/auth/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener perfil' });
//   }
// });

// ==================== RUTAS DE GESTIÓN DE USUARIOS (ADMIN) ====================

// Obtener todos los usuarios (solo admin)
// app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener usuarios' });
//   }
// });

// Crear usuario admin (solo admin)
// app.post('/api/users/admin', authenticateToken, requireAdmin, async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: role || 'admin'
//     });

//     await newUser.save();

//     res.status(201).json({ 
//       message: 'Usuario creado exitosamente',
//       user: { 
//         id: newUser._id, 
//         username: newUser.username, 
//         email: newUser.email, 
//         role: newUser.role 
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al crear usuario: ' + error.message });
//   }
// });

// Actualizar rol de usuario (solo admin)
// app.put('/api/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
//   try {
//     const { role } = req.body;
    
//     if (!['admin', 'vip', 'free'].includes(role)) {
//       return res.status(400).json({ error: 'Rol inválido' });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { role },
//       { new: true }
//     ).select('-password');

//     if (!user) {
//       return res.status(404).json({ error: 'Usuario no encontrado' });
//     }

//     res.json({ message: 'Rol actualizado', user });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al actualizar rol' });
//   }
// });

// Eliminar usuario (solo admin)
// app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ error: 'Usuario no encontrado' });
//     }

//     res.json({ message: 'Usuario eliminado exitosamente' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al eliminar usuario' });
//   }
// });

// ==================== RUTAS DE LIBROS ====================

// Obtener todos los libros (filtrado por rol)
// app.get('/api/books', authenticateToken, async (req, res) => {
//   try {
//     let query = {};
    
//     // Si el usuario es FREE, solo puede ver libros no exclusivos
//     if (req.user.role === 'free') {
//       query.isExclusive = false;
//     }
//     // VIP y ADMIN pueden ver todos los libros

//     const books = await Book.find(query).populate('createdBy', 'username');
//     res.json(books);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener libros' });
//   }
// });

// Obtener un libro por ID
// app.get('/api/books/:id', authenticateToken, async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id).populate('createdBy', 'username');
    
//     if (!book) {
//       return res.status(404).json({ error: 'Libro no encontrado' });
//     }

//     // Verificar si el usuario tiene acceso
//     if (book.isExclusive && req.user.role === 'free') {
//       return res.status(403).json({ error: 'Este libro es exclusivo para usuarios VIP' });
//     }

//     res.json(book);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener libro' });
//   }
// });

// Crear libro (solo admin)
// app.post('/api/books', authenticateToken, requireAdmin, async (req, res) => {
//   try {
//     const { title, author, description, year, genre, isExclusive, coverUrl } = req.body;

//     const book = new Book({
//       title,
//       author,
//       description,
//       year,
//       genre,
//       isExclusive: isExclusive || false,
//       coverUrl,
//       createdBy: req.user.id
//     });

//     await book.save();

//     res.status(201).json({ 
//       message: 'Libro creado exitosamente',
//       book 
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al crear libro: ' + error.message });
//   }
// });

// Actualizar libro (solo admin)
// app.put('/api/books/:id', authenticateToken, requireAdmin, async (req, res) => {
//   try {
//     const book = await Book.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!book) {
//       return res.status(404).json({ error: 'Libro no encontrado' });
//     }

//     res.json({ message: 'Libro actualizado', book });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al actualizar libro' });
//   }
// });

// Eliminar libro (solo admin)
// app.delete('/api/books/:id', authenticateToken, requireAdmin, async (req, res) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
    
//     if (!book) {
//       return res.status(404).json({ error: 'Libro no encontrado' });
//     }

//     res.json({ message: 'Libro eliminado exitosamente' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al eliminar libro' });
//   }
// });


// ==================== RUTA PARA CREAR ADMIN INICIAL ====================
// Esta ruta debe usarse SOLO UNA VEZ para crear el primer admin
app.post('/api/init/admin', async (req, res) => {
  try {
    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ error: 'Ya existe un usuario administrador' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@biblioteca.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();

    res.status(201).json({ 
      message: 'Administrador inicial creado',
      credentials: {
        email: 'admin@biblioteca.com',
        password: 'admin123',
        warning: '⚠️ CAMBIAR CONTRASEÑA INMEDIATAMENTE'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear admin: ' + error.message });
  }
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Base de datos: MongoDB - biblioteca`);
  console.log(`\n📝 Para crear el admin inicial, ejecuta:`);
  console.log(`   POST http://localhost:${PORT}/api/init/admin`);
});
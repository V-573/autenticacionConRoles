// src/routes/users.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const router = express.Router();

// Importar middlewares centralizados
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Obtenemos el modelo ya registrado
const User = () => mongoose.model('User');

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User().find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// POST /api/users/admin - Crear usuario admin (solo admin)
router.post('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new (User())({
      username,
      email,
      password: hashedPassword,
      role: role || 'admin',
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario: ' + error.message });
  }
});

// PUT /api/users/:id/role - Actualizar rol de usuario (solo admin)
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['admin', 'vip', 'free'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const user = await User().findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Rol actualizado', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
});

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User().findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;


// src/routes/books.routes.js
const express = require('express');
const mongoose = require('mongoose');

const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Obtenemos el modelo ya registrado por server.js
const Book = () => mongoose.model('Book');

// GET /api/books - lista (filtra por rol)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'free') {
      query.isExclusive = false;
    }
    const books = await Book().find(query).populate('createdBy', 'username');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libros' });
  }
});

// GET /api/books/:id - detalle
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book().findById(req.params.id).populate('createdBy', 'username');
    if (!book) return res.status(404).json({ error: 'Libro no encontrado' });

    if (book.isExclusive && req.user.role === 'free') {
      return res.status(403).json({ error: 'Este libro es exclusivo para usuarios VIP' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libro' });
  }
});

// POST /api/books - crear (solo admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, author, description, year, genre, isExclusive, coverUrl } = req.body;

    const book = new (Book())({
      title,
      author,
      description,
      year,
      genre,
      isExclusive: !!isExclusive,
      coverUrl,
      createdBy: req.user.id,
    });

    await book.save();

    res.status(201).json({
      message: 'Libro creado exitosamente',
      book,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear libro: ' + error.message });
  }
});

// PUT /api/books/:id - actualizar (solo admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book().findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Libro no encontrado' });

    res.json({ message: 'Libro actualizado', book });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar libro' });
  }
});

// DELETE /api/books/:id - eliminar (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book().findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Libro no encontrado' });

    res.json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar libro' });
  }
});

module.exports = router;
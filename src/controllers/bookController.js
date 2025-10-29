// src/controllers/bookController.js
const Book = require('../models/Book');

// Obtener todos los libros (filtrado por rol)
exports.getAllBooks = async (req, res) => {
  try {
    const query = {};

    // Si el usuario es FREE, solo puede ver libros no exclusivos
    if (req.user.role === 'free') {
      query.isExclusive = false;
    }
    // VIP y ADMIN pueden ver todos los libros

    const books = await Book.find(query).populate('createdBy', 'username');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libros' });
  }
};

// Obtener un libro por ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('createdBy', 'username');

    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Verificar si el usuario tiene acceso
    if (book.isExclusive && req.user.role === 'free') {
      return res.status(403).json({ error: 'Este libro es exclusivo para usuarios VIP' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libro' });
  }
};

// Crear nuevo libro
exports.createBook = async (req, res) => {
  try {
    const { title, author, description, year, genre, isExclusive, coverUrl } = req.body;

    const book = new Book({
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
};

// Actualizar libro
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json({ message: 'Libro actualizado', book });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar libro' });
  }
};

// Eliminar libro
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar libro' });
  }
};
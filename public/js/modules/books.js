// ==================== BOOKS MODULE ====================

// Función para cargar todos los libros
async function loadBooks() {
    try {
        const books = await apiClient.get(CONFIG.ENDPOINTS.BOOKS.LIST);
        
        // Verificar que books sea un array
        if (Array.isArray(books)) {
            displayBooks(books);
        } else {
            console.error('La respuesta no es un array:', books);
            displayBooks([]); // Mostrar lista vacía
        }
    } catch (error) {
        console.error('Error al cargar libros:', error);
        displayBooks([]); // Mostrar lista vacía en caso de error
    }
}

// Función para mostrar libros en el DOM
function displayBooks(books) {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';

    if (books.length === 0) {
        grid.innerHTML = '<p>No hay libros disponibles en este momento.</p>';
        return;
    }

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = book.isExclusive ? 'book-card exclusive' : 'book-card';
        
        card.innerHTML = `
            <div class="book-cover">📖</div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">por ${book.author}</div>
            ${book.isExclusive ? '<span class="badge badge-vip">VIP</span>' : ''}
            <p style="color: #666; font-size: 14px; margin-top: 10px;">${book.description || 'Sin descripción'}</p>
            <p style="color: #999; font-size: 12px; margin-top: 5px;">
                ${book.genre || ''} ${book.year ? '• ' + book.year : ''}
            </p>
            ${window.currentUser && window.currentUser.role === 'admin' ? `
                <div class="book-actions">
                    <button class="btn btn-danger" onclick="deleteBook('${book._id}')">Eliminar</button>
                </div>
            ` : ''}
        `;
        
        grid.appendChild(card);
    });
}

// Función para crear un nuevo libro
async function createBook() {
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        description: document.getElementById('bookDescription').value,
        year: document.getElementById('bookYear').value || null,
        genre: document.getElementById('bookGenre').value,
        isExclusive: document.getElementById('bookExclusive').checked
    };

    try {
        const data = await apiClient.post(CONFIG.ENDPOINTS.BOOKS.CREATE, bookData);
        
        alert('¡Libro creado exitosamente!');
        document.getElementById('bookForm').reset();
        showTab('books');
        loadBooks();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Función para eliminar un libro
async function deleteBook(bookId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) return;

    try {
        const endpoint = CONFIG.ENDPOINTS.BOOKS.DELETE.replace(':id', bookId);
        await apiClient.delete(endpoint);
        
        alert('Libro eliminado exitosamente');
        loadBooks();
    } catch (error) {
        alert('Error al eliminar: ' + error.message);
    }
}

// Exponer funciones globalmente para que puedan ser llamadas desde HTML
window.loadBooks = loadBooks;
window.displayBooks = displayBooks;
window.createBook = createBook;
window.deleteBook = deleteBook;
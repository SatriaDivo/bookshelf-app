// Book handling logic for Bookshelf App

// API endpoint for our backend
const API_BASE_URL = 'http://localhost:3000/books';

// DOM element references
const completeBookListContainer = document.querySelector('#completeBookList');
const incompleteBookListContainer = document.querySelector('#incompleteBookList');
const bookForm = document.querySelector('#bookForm');
const searchForm = document.querySelector('#searchBook');
const isCompleteCheckbox = document.querySelector('#bookFormIsComplete');
const statusText = document.querySelector('.status-text');

// Update status text when checkbox changes
isCompleteCheckbox.addEventListener('change', function() {
  statusText.textContent = this.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
});

// Fetch all books from server
const fetchAllBooks = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch books');
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    showAlert('Gagal memuat buku. Silakan coba lagi.', 'error');
    return [];
  }
};

// Save new book to server
const saveBook = async (book) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to save book');
    showAlert('Buku berhasil ditambahkan!', 'success');
    return await response.json();
  } catch (error) {
    console.error('Error saving book:', error);
    showAlert('Gagal menambahkan buku. Silakan coba lagi.', 'error');
    throw error;
  }
};

// Update book status
const updateBookStatus = async (id, isComplete) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isComplete }),
    });
    if (!response.ok) throw new Error('Failed to update book');
    showAlert('Status buku berhasil diubah!', 'success');
    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    showAlert('Gagal mengubah status buku.', 'error');
    throw error;
  }
};

// Delete book
const deleteBook = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete book');
    showAlert('Buku berhasil dihapus!', 'success');
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    showAlert('Gagal menghapus buku.', 'error');
    throw error;
  }
};

// Render book lists
const renderBookLists = async (books = null) => {
  try {
    const bookData = books || await fetchAllBooks();
    
    const completeBooks = bookData.filter(book => book.isComplete);
    const incompleteBooks = bookData.filter(book => !book.isComplete);
    
    completeBookListContainer.innerHTML = generateBookListHTML(completeBooks);
    incompleteBookListContainer.innerHTML = generateBookListHTML(incompleteBooks);
  } catch (error) {
    console.error('Error rendering books:', error);
  }
};

// Generate HTML for book list
const generateBookListHTML = (books) => {
  if (books.length === 0) {
    return '<p class="empty-message">Tidak ada buku</p>';
  }
  
  return books.map(book => `
    <div class="book-card ${book.isComplete ? 'completed' : ''}" data-bookid="${book.id}">
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">Penulis: ${book.author}</p>
        <p class="book-year">Tahun: ${book.year}</p>
      </div>
      <div class="book-actions">
        <button class="action-btn ${book.isComplete ? 'incomplete-btn' : 'complete-btn'}" data-action="toggle">
          ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
        </button>
        <button class="action-btn delete-btn" data-action="delete">Hapus buku</button>
      </div>
    </div>
  `).join('');
};

// Show alert message
const showAlert = (message, type) => {
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;
  
  document.body.prepend(alertElement);
  
  setTimeout(() => {
    alertElement.remove();
  }, 3000);
};

// Event delegation for book actions
document.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('action-btn')) return;
  
  const bookCard = e.target.closest('.book-card');
  if (!bookCard) return;
  
  const bookId = bookCard.dataset.bookid;
  const action = e.target.dataset.action;
  
  try {
    if (action === 'toggle') {
      const isCurrentlyComplete = e.target.classList.contains('incomplete-btn');
      await updateBookStatus(bookId, !isCurrentlyComplete);
      await renderBookLists();
    } else if (action === 'delete') {
      if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
        await deleteBook(bookId);
        await renderBookLists();
      }
    }
  } catch (error) {
    console.error('Error handling book action:', error);
  }
});

// Add new book
bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.querySelector('#bookFormTitle').value.trim();
  const author = document.querySelector('#bookFormAuthor').value.trim();
  const year = document.querySelector('#bookFormYear').value.trim();
  const isComplete = document.querySelector('#bookFormIsComplete').checked;
  
  if (!title || !author || !year) {
    showAlert('Harap isi semua field dengan benar!', 'error');
    return;
  }
  
  try {
    const newBook = {
      title,
      author,
      year: Number(year),
      isComplete
    };
    
    await saveBook(newBook);
    bookForm.reset();
    statusText.textContent = 'Belum selesai dibaca';
    await renderBookLists();
  } catch (error) {
    console.error('Error adding book:', error);
  }
});

// Search books
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const searchTerm = document.querySelector('#searchBookTitle').value.trim();
  
  if (!searchTerm) {
    await renderBookLists();
    return;
  }
  
  try {
    const allBooks = await fetchAllBooks();
    const filteredBooks = allBooks.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    await renderBookLists(filteredBooks);
  } catch (error) {
    console.error('Error searching books:', error);
  }
});

// Initialize the app
window.addEventListener('DOMContentLoaded', async () => {
  await renderBookLists();
});
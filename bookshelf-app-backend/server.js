const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Book } = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from current directory (optional)
app.use(express.static('./'));

// GET all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// GET book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// POST new book
app.post('/books', async (req, res) => {
  try {
    const newBook = await Book.create(req.body);  // ID akan otomatis dihasilkan
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// PUT update book status (isComplete)
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.json(book);
    } else {
      res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// DELETE book
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Book.destroy({ where: { id } });
    if (result) {
      return res.status(200).json({ message: 'Buku berhasil dihapus' });
    } else {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Akses aplikasi di: http://localhost:${PORT}`);
});
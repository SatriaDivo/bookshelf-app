# 📚 Bookshelf App

Aplikasi manajemen buku sederhana dengan kemampuan menambah, melihat, dan menyimpan data buku. Aplikasi ini dibagi menjadi dua bagian:

- **Backend**: Dibuat menggunakan Node.js, Express, Sequelize, dan MySQL.
- **Frontend**: Dibuat dengan HTML, CSS, dan JavaScript murni.

## 📦 Fitur Utama

- Menampilkan daftar buku
- Menambah buku baru
- Menyimpan data buku di database MySQL
- Komunikasi frontend dan backend via REST API

---

## ⚙️ Setup Proyek Lengkap

### 🔧 1. Setup Backend

#### a. Inisialisasi Proyek Node.js
mkdir bookshelf-app-backend
cd bookshelf-app-backend
npm init -y

Instal dependency:
npm install express sequelize mysql2 cors body-parser

Instal Sequelize CLI secara lokal:
npx sequelize-cli init

Struktur direktori akan terbentuk seperti ini:
bookshelf-app-backend/
├── config/
├── models/
├── migrations/
├── seeders/
└── server.js (buat manual)

b. Buat Database di MySQL
Masuk ke MySQL dan jalankan:
CREATE DATABASE bookshelf_db;

c. Konfigurasi config/config.json
Edit file config/config.json:
{
  "development": {
    "username": "root",
    "password": "",
    "database": "bookshelf_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
💡 Sesuaikan username dan password dengan MySQL Anda.

d. Buat Model dan Migration
npx sequelize-cli model:generate --name Book --attributes title:string,author:string,year:integer,isComplete:boolean

File yang dihasilkan:
models/book.js
migrations/xxxx-create-book.js

e. Jalankan Migrasi Database
npx sequelize-cli db:migrate

f. Buat File server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Book } = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// GET semua buku
app.get('/books', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

// POST buku baru
app.post('/books', async (req, res) => {
  const newBook = await Book.create(req.body);
  res.json(newBook);
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));

🎨 2. Setup Frontend
a. Struktur Folder
bookshelf-app-frontend/
├── index.html
├── style.css
└── script.js

b. index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bookshelf App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>📚 Bookshelf App</h1>
  <form id="book-form">
    <input type="text" id="title" placeholder="Judul Buku" required />
    <input type="text" id="author" placeholder="Penulis" required />
    <input type="number" id="year" placeholder="Tahun Terbit" required />
    <button type="submit">Tambah Buku</button>
  </form>
  <ul id="book-list"></ul>
  <script src="script.js"></script>
</body>
</html>

c. style.css
body {
  font-family: sans-serif;
  padding: 20px;
}

form input, button {
  margin: 5px;
}

ul {
  list-style: none;
  padding-left: 0;
}

d. script.js
document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const book = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    year: parseInt(document.getElementById('year').value),
    isComplete: false
  };
  await fetch('http://localhost:3000/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });
  location.reload();
});

window.onload = async () => {
  const res = await fetch('http://localhost:3000/books');
  const books = await res.json();
  const list = document.getElementById('book-list');
  books.forEach(book => {
    const item = document.createElement('li');
    item.textContent = `${book.title} - ${book.author} (${book.year})`;
    list.appendChild(item);
  });
};

▶️ Menjalankan Aplikasi
1. Jalankan Backend
cd bookshelf-app-backend
node server.js


2. Jalankan Frontend
Buka file index.html di browser, atau gunakan ekstensi Live Server (VSCode).

✍️ Author
Satria Divo
GitHub: @SatriaDivo

📄 Lisensi
Proyek ini bersifat open source dan bebas digunakan untuk pembelajaran.


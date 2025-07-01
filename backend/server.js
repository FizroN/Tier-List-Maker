// backend/server.js
require('dotenv').config(); // Ładuje zmienne środowiskowe z .env

const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Użyj trybu verbose do debugowania
const cors = require('cors');
const multer = require('multer'); // Do obsługi przesyłania plików
const path = require('path'); // Do pracy ze ścieżkami plików
const fs = require('fs'); // Do obsługi plików (np. sprawdzania czy folder istnieje)

const app = express();
const PORT = process.env.PORT || 2137;
const DB_PATH = process.env.DATABASE_PATH;
const UPLOADS_DIR = process.env.UPLOADS_DIR;

// ... konfiguracja bazy danych SQLite ...
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Błąd połączenia z bazą danych SQLite:', err.message);
  } else {
    console.log('✅ Połączono z bazą danych SQLite: ' + DB_PATH);
    // Zaktualizuj schemat tabeli, aby przechowywać ścieżkę do obrazu snapshotu
    db.run(`CREATE TABLE IF NOT EXISTS tierlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      snapshotImageUrl TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// --- Middleware ---
app.use(cors()); // Umożliwia komunikację między frontendem a backendem

// jeśli folder uploads nie istnieje
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Udostępnianie folderu `uploads` statycznie, aby obrazy były dostępne z przeglądarki
app.use('/uploads', express.static(path.join(__dirname, UPLOADS_DIR)));

// --- Konfiguracja Multer do przesyłania plików ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR); // Pliki będą zapisywane w folderze 'uploads'
  },
  filename: (req, file, cb) => {
    // Generuj unikalną nazwę pliku, zachowując rozszerzenie
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ storage: storage });

// --- Route'y API ---

// GET /api/lists - Pobierz wszystkie listy
app.get('/api/tierlists', (req, res) => { // Zmieniono z /api/lists na /api/tierlists dla spójności
  db.all('SELECT * FROM tierlists ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }
    res.json(rows);
  });
});
// GET /api/lists/:id - Pobierz konkretną listę
app.get('/api/tierlists/:id', (req, res) => {
  const { id } = req.params;
  console.log('Fetching tierlist with id=', id); 
  db.get(
    'SELECT * FROM tierlists WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        console.error('DB error:', err.message);
        return res.status(500).json({ message: err.message });
      }
      if (!row) {
        console.log(`No row found for id=${id}`); 
        return res.status(404).json({ message: 'Tier list not found' });
      }
      res.json(row);
    }
  );
});

// POST /api/tierlists - Dodaj nową listę z obrazem snapshotu
// Użyj upload.single('snapshotImage'), gdzie 'snapshotImage' to nazwa pola z plikiem w FormData
app.post('/api/tierlists', upload.single('snapshotImage'), (req, res) => {
  const { title, description, author } = req.body; // Dane tekstowe są w req.body
  const snapshotImageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Ścieżka do zapisanego obrazu

  if (!title || !author) {
    // Jeśli brakuje wymaganych pól, usuń przesłany obraz, jeśli istnieje
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Błąd usuwania pliku:', err);
      });
    }
    return res.status(400).json({ message: 'Tytuł i autor są wymagane.' });
  }

  db.run('INSERT INTO tierlists (title, description, author, snapshotImageUrl) VALUES (?, ?, ?, ?)',
    [title, description, author, snapshotImageUrl],
    function(err) {
      if (err) {
        // Jeśli wystąpił błąd wstawiania, usuń przesłany obraz
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Błąd usuwania pliku:', err);
          });
        }
        res.status(400).json({ message: err.message });
        return;
      }
      // Zwróć nowo dodany wpis wraz z jego ID i URL obrazu
      res.status(201).json({
        id: this.lastID,
        title, description, author, snapshotImageUrl,
        createdAt: new Date().toISOString()
      });
    }
  );
});

// --- Uruchomienie serwera ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server (SQLite) działa na http://localhost:${PORT}`);
});
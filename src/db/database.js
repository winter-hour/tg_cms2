import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../cms.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключено к SQLite3');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      media TEXT,
      status TEXT NOT NULL,
      scheduled_at TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Ошибка создания таблицы:', err.message);
    } else {
      console.log('Таблица posts готова');
    }
  });
});

export function addPost(text, media, status, scheduledAt, callback) {
  const stmt = db.prepare('INSERT INTO posts (text, media, status, scheduled_at) VALUES (?, ?, ?, ?)');
  stmt.run(text, media, status, scheduledAt, function (err) {
    if (err) {
      console.error('Ошибка добавления поста:', err.message);
    } else {
      console.log('Пост добавлен с ID:', this.lastID);
    }
    callback(err, this.lastID);
  });
  stmt.finalize();
}

export function getPosts(callback) {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) {
      console.error('Ошибка получения постов:', err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

export function updatePost(id, text, media, status, scheduledAt, callback) {
  const stmt = db.prepare('UPDATE posts SET text = ?, media = ?, status = ?, scheduled_at = ? WHERE id = ?');
  stmt.run(text, media, status, scheduledAt, id, function (err) {
    if (err) {
      console.error('Ошибка обновления поста:', err.message);
    } else {
      console.log('Пост обновлён с ID:', id);
    }
    callback(err);
  });
  stmt.finalize();
}

export function deletePost(id, callback) {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  stmt.run(id, function (err) {
    if (err) {
      console.error('Ошибка удаления поста:', err.message);
    } else {
      console.log('Пост удалён с ID:', id);
    }
    callback(err);
  });
  stmt.finalize();
}

export { db };
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const db = new sqlite3.Database(path.join(__dirname, '../../cms.db'), (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключено к SQLite3');
  }
});

// Создание таблицы posts
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER,
      channel_id INTEGER,
      user_id INTEGER,
      title TEXT,
      text TEXT NOT NULL,
      is_published BOOLEAN DEFAULT 0,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES Posts_Group(id) ON DELETE SET NULL,
      FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы posts:', err.message);
      else console.log('Таблица posts готова');
    }
  );

  // Создание таблицы Posts_Group
  db.run(
    `CREATE TABLE IF NOT EXISTS Posts_Group (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      group_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы Posts_Group:', err.message);
      else console.log('Таблица Posts_Group готова');
    }
  );

  // Создание таблицы Post_Property_Groups
  db.run(
    `CREATE TABLE IF NOT EXISTS Post_Property_Groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL,
      group_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы Post_Property_Groups:', err.message);
      else console.log('Таблица Post_Property_Groups готова');
    }
  );

  // Создание таблицы Post_Property_Values
  db.run(
    `CREATE TABLE IF NOT EXISTS Post_Property_Values (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER,
      property_name TEXT NOT NULL,
      value_type TEXT CHECK(value_type IN ('text', 'number', 'date', 'boolean')),
      property_value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES Post_Property_Groups(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы Post_Property_Values:', err.message);
      else console.log('Таблица Post_Property_Values готова');
    }
  );

  // Создание таблицы Post_Properties
  db.run(
    `CREATE TABLE IF NOT EXISTS Post_Properties (
      post_id INTEGER,
      value_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (post_id, value_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (value_id) REFERENCES Post_Property_Values(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы Post_Properties:', err.message);
      else console.log('Таблица Post_Properties готова');
    }
  );

  // Создание таблицы channels
  db.run(
    `CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы channels:', err.message);
      else console.log('Таблица channels готова');
    }
  );

  // Создание таблицы users
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы users:', err.message);
      else console.log('Таблица users готова');
    }
  );

  // Создание таблицы Attached_Files
  db.run(
    `CREATE TABLE IF NOT EXISTS Attached_Files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      file_path TEXT NOT NULL,
      file_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы Attached_Files:', err.message);
      else console.log('Таблица Attached_Files готова');
    }
  );

  // Создание таблицы Templates
  db.run(
    `CREATE TABLE IF NOT EXISTS Templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_name TEXT NOT NULL,
      template_text TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы Templates:', err.message);
      else console.log('Таблица Templates готова');
    }
  );

  // Создание таблицы Post_Templates
  db.run(
    `CREATE TABLE IF NOT EXISTS Post_Templates (
      post_id INTEGER,
      template_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (post_id, template_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (template_id) REFERENCES Templates(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы Post_Templates:', err.message);
      else console.log('Таблица Post_Templates готова');
    }
  );
});

// Функции для работы с постами
export function addPost(groupId, channelId, userId, title, text, isPublished, publishedAt, callback) {
  const stmt = db.prepare(
    'INSERT INTO posts (group_id, channel_id, user_id, title, text, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  stmt.run(groupId, channelId, userId, title, text, isPublished ? 1 : 0, publishedAt, function (err) {
    callback(err, this.lastID);
  });
  stmt.finalize();
}

export function getPosts(callback) {
  db.all(
    'SELECT id, group_id, channel_id, user_id, title, text, is_published, published_at, created_at, updated_at FROM posts ORDER BY id DESC',
    (err, rows) => {
      callback(err, rows);
    }
  );
}

export function updatePost(id, groupId, channelId, userId, title, text, isPublished, publishedAt, callback) {
  const stmt = db.prepare(
    'UPDATE posts SET group_id = ?, channel_id = ?, user_id = ?, title = ?, text = ?, is_published = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  stmt.run(groupId, channelId, userId, title, text, isPublished ? 1 : 0, publishedAt, id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

export function deletePost(id, callback) {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  stmt.run(id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

export function addAttachedFile(postId, filePath, fileType, callback) {
  const stmt = db.prepare('INSERT INTO Attached_Files (post_id, file_path, file_type) VALUES (?, ?, ?)');
  stmt.run(postId, filePath, fileType, function (err) {
    callback(err, this.lastID);
  });
  stmt.finalize();
}

export function getAttachedFiles(postId, callback) {
  db.all('SELECT * FROM Attached_Files WHERE post_id = ?', [postId], (err, rows) => {
    callback(err, rows);
  });
}

// Функции для работы с группами постов
export function addPostGroup(title, groupDescription, callback) {
  const stmt = db.prepare('INSERT INTO Posts_Group (title, group_description) VALUES (?, ?)');
  stmt.run(title, groupDescription, function (err) {
    callback(err, this.lastID);
  });
  stmt.finalize();
}

export function getPostGroups(callback) {
  db.all('SELECT * FROM Posts_Group ORDER BY created_at DESC', (err, rows) => {
    callback(err, rows);
  });
}

export function updatePostGroup(id, title, groupDescription, callback) {
  const stmt = db.prepare(
    'UPDATE Posts_Group SET title = ?, group_description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  stmt.run(title, groupDescription, id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

export function deletePostGroup(id, callback) {
  const stmt = db.prepare('DELETE FROM Posts_Group WHERE id = ?');
  stmt.run(id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

// Функции для работы с группами свойств
export function addPropertyGroup(groupName, groupDescription, callback) {
  const stmt = db.prepare('INSERT INTO Post_Property_Groups (group_name, group_description) VALUES (?, ?)');
  stmt.run(groupName, groupDescription, function (err) {
    callback(err, this.lastID);
  });
  stmt.finalize();
}

export function getPropertyGroups(callback) {
  db.all('SELECT * FROM Post_Property_Groups ORDER BY created_at DESC', (err, rows) => {
    callback(err, rows);
  });
}

export function updatePropertyGroup(id, groupName, groupDescription, callback) {
  const stmt = db.prepare(
    'UPDATE Post_Property_Groups SET group_name = ?, group_description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  stmt.run(groupName, groupDescription, id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

export function deletePropertyGroup(id, callback) {
  const stmt = db.prepare('DELETE FROM Post_Property_Groups WHERE id = ?');
  stmt.run(id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

// Функции для работы со значениями свойств
export function addPropertyValue(groupId, propertyName, valueType, propertyValue, callback) {
  const stmt = db.prepare(
    'INSERT INTO Post_Property_Values (group_id, property_name, value_type, property_value) VALUES (?, ?, ?, ?)'
  );
  stmt.run(groupId, propertyName, valueType, propertyValue, function (err) {
    callback(err, this.lastID);
  });
  stmt.finalize();
}

export function getPropertyValues(groupId, callback) {
  db.all(
    'SELECT * FROM Post_Property_Values WHERE group_id = ? ORDER BY created_at DESC',
    [groupId],
    (err, rows) => {
      callback(err, rows);
    }
  );
}

export function updatePropertyValue(id, propertyName, valueType, propertyValue, callback) {
  const stmt = db.prepare(
    'UPDATE Post_Property_Values SET property_name = ?, value_type = ?, property_value = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  stmt.run(propertyName, valueType, propertyValue, id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

export function deletePropertyValue(id, callback) {
  const stmt = db.prepare('DELETE FROM Post_Property_Values WHERE id = ?');
  stmt.run(id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

// Функции для работы со свойствами постов
export function addPostProperty(postId, valueId, callback) {
  const stmt = db.prepare('INSERT INTO Post_Properties (post_id, value_id) VALUES (?, ?)');
  stmt.run(postId, valueId, (err) => {
    callback(err);
  });
  stmt.finalize();
}

export function getPostProperties(postId, callback) {
  db.all(
    `SELECT pv.* FROM Post_Properties pp
     JOIN Post_Property_Values pv ON pp.value_id = pv.id
     WHERE pp.post_id = ?`,
    [postId],
    (err, rows) => {
      callback(err, rows);
    }
  );
}

export function removePostProperty(postId, valueId, callback) {
  const stmt = db.prepare('DELETE FROM Post_Properties WHERE post_id = ? AND value_id = ?');
  stmt.run(postId, valueId, (err) => {
    callback(err);
  });
  stmt.finalize();
}

// Функции для работы с шаблонами
export function addTemplate(templateName, templateText, description, callback) {
  const stmt = db.prepare('INSERT INTO Templates (template_name, template_text, description) VALUES (?, ?, ?)');
  stmt.run(templateName, templateText, description, function (err) {
    callback(err, this.lastID);
  });
  stmt.finalize();
}

export function getTemplates(callback) {
  db.all('SELECT * FROM Templates ORDER BY created_at DESC', (err, rows) => {
    callback(err, rows);
  });
}

export function updateTemplate(id, templateName, templateText, description, callback) {
  const stmt = db.prepare('UPDATE Templates SET template_name = ?, template_text = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  stmt.run(templateName, templateText, description, id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

export function deleteTemplate(id, callback) {
  const stmt = db.prepare('DELETE FROM Templates WHERE id = ?');
  stmt.run(id, (err) => {
    callback(err);
  });
  stmt.finalize();
}

// Функции для связи постов и шаблонов
export function addPostTemplate(postId, templateId, callback) {
  const stmt = db.prepare('INSERT INTO Post_Templates (post_id, template_id) VALUES (?, ?)');
  stmt.run(postId, templateId, (err) => {
    callback(err);
  });
  stmt.finalize();
}

export function getPostTemplates(postId, callback) {
  db.all(
    `SELECT t.* FROM Post_Templates pt
     JOIN Templates t ON pt.template_id = t.id
     WHERE pt.post_id = ?`,
    [postId],
    (err, rows) => {
      callback(err, rows);
    }
  );
}

export function removePostTemplate(postId, templateId, callback) {
  const stmt = db.prepare('DELETE FROM Post_Templates WHERE post_id = ? AND template_id = ?');
  stmt.run(postId, templateId, (err) => {
    callback(err);
  });
  stmt.finalize();
}
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, addPost, getPosts, updatePost, deletePost } from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:5173');
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  ipcMain.handle('add-post', async (event, post) => {
    return new Promise((resolve, reject) => {
      addPost(post.text, post.media, post.status, post.scheduledAt, (err, id) => {
        if (err) {
          reject(err);
        } else {
          resolve(id);
        }
      });
    });
  });

  ipcMain.handle('get-posts', async () => {
    return new Promise((resolve, reject) => {
      getPosts((err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('update-post', async (event, { id, text, media, status, scheduledAt }) => {
    return new Promise((resolve, reject) => {
      updatePost(id, text, media, status, scheduledAt, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  ipcMain.handle('delete-post', async (event, id) => {
    return new Promise((resolve, reject) => {
      deletePost(id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close((err) => {
      if (err) console.error('Ошибка закрытия базы:', err.message);
      app.quit();
    });
  }
});
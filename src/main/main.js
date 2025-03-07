import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, addPost, getPosts, updatePost, deletePost, addAttachedFile, getAttachedFiles } from '../db/database.js';
import fs from 'fs';

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

  ipcMain.handle('update-post', async (event, id, { text, media, status, scheduledAt }) => {
    console.log('Updating post - id:', id, 'data:', { text, media, status, scheduledAt }); // Отладка
    return new Promise((resolve, reject) => {
      updatePost(id, text, media, status, scheduledAt, (err) => {
        if (err) {
          console.error('Error updating post:', err.message); // Отладка
          reject(err);
        } else {
          console.log('Post updated successfully'); // Отладка
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

  ipcMain.handle('add-attached-file', async (event, postId, filePath, fileName, fileType) => {
    console.log('Received postId:', postId);
    console.log('Received filePath:', filePath);
    console.log('Received fileName:', fileName);
    console.log('Received fileType:', fileType);
    if (!filePath) {
      throw new Error('File path is undefined');
    }
    if (typeof filePath !== 'string') {
      throw new Error(`Invalid filePath type: ${typeof filePath}`);
    }
    return new Promise((resolve, reject) => {
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      const newFilePath = path.join(uploadsDir, fileName);
      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          console.error('Error reading file:', err.message);
          reject(err);
          return;
        }
        fs.writeFile(newFilePath, fileData, (err) => {
          if (err) {
            console.error('Error writing file:', err.message);
            reject(err);
            return;
          }
          addAttachedFile(postId, newFilePath, fileType, (err, fileId) => {
            if (err) {
              console.error('Error adding file to DB:', err.message);
              reject(err);
            } else {
              resolve({ id: fileId, filePath: newFilePath });
            }
          });
        });
      });
    });
  });

  ipcMain.handle('get-attached-files', async (event, postId) => {
    return new Promise((resolve, reject) => {
      getAttachedFiles(postId, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Videos', extensions: ['mp4', 'avi'] },
        { name: 'Documents', extensions: ['pdf', 'doc', 'docx'] },
      ],
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths.map(filePath => ({
        path: filePath,
        name: path.basename(filePath),
      }));
    }
    return [];
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
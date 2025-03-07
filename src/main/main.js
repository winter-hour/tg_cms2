import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, addPost, getPosts, updatePost, deletePost, addAttachedFile, getAttachedFiles, addTemplate, getTemplates, updateTemplate, deleteTemplate, addPostTemplate, getPostTemplates, removePostTemplate, addPostGroup, getPostGroups, updatePostGroup, deletePostGroup, addPropertyGroup, getPropertyGroups, updatePropertyGroup, deletePropertyGroup, addPropertyValue, getPropertyValues, updatePropertyValue, deletePropertyValue, addPostProperty, getPostProperties, removePostProperty } from '../db/database.js';
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
  ipcMain.handle('add-post', async (event, groupId, channelId, userId, title, text, isPublished, publishedAt) => {
    return new Promise((resolve, reject) => {
      addPost(groupId, channelId, userId, title, text, isPublished, publishedAt, (err, id) => {
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

  ipcMain.handle('update-post', async (event, id, groupId, channelId, userId, title, text, isPublished, publishedAt) => {
    console.log('Обновление поста - id:', id, 'данные:', { groupId, channelId, userId, title, text, isPublished, publishedAt });
    return new Promise((resolve, reject) => {
      updatePost(id, groupId, channelId, userId, title, text, isPublished, publishedAt, (err) => {
        if (err) {
          console.error('Ошибка обновления поста:', err.message);
          reject(err);
        } else {
          console.log('Пост успешно обновлён');
          resolve();
        }
      });
    });
  });

  ipcMain.handle('delete-post', async (event, id) => {
    console.log('Начало удаления поста с id:', id);
    return new Promise((resolve, reject) => {
      getAttachedFiles(id, (err, files) => {
        if (err) {
          console.error('Ошибка получения прикреплённых файлов:', err.message);
          reject(err);
          return;
        }
        if (files && files.length > 0) {
          console.log('Найдены файлы для удаления:', files);
          files.forEach(file => {
            const filePath = file.file_path;
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Ошибка удаления файла:', err.message, 'Путь:', filePath);
              } else {
                console.log('Файл успешно удалён:', filePath);
              }
            });
          });
          db.run('DELETE FROM Attached_Files WHERE post_id = ?', id, (err) => {
            if (err) {
              console.error('Ошибка удаления записей из Attached_Files:', err.message);
              reject(err);
              return;
            }
            console.log('Записи из Attached_Files удалены для поста id:', id);
            deletePost(id, (err) => {
              if (err) {
                console.error('Ошибка удаления поста:', err.message);
                reject(err);
              } else {
                console.log('Пост успешно удалён');
                resolve();
              }
            });
          });
        } else {
          deletePost(id, (err) => {
            if (err) {
              console.error('Ошибка удаления поста:', err.message);
              reject(err);
            } else {
              console.log('Пост успешно удалён (без файлов)');
              resolve();
            }
          });
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
          console.error('Ошибка чтения файла:', err.message);
          reject(err);
          return;
        }
        fs.writeFile(newFilePath, fileData, (err) => {
          if (err) {
            console.error('Ошибка записи файла:', err.message);
            reject(err);
            return;
          }
          addAttachedFile(postId, newFilePath, fileType, (err, fileId) => {
            if (err) {
              console.error('Ошибка добавления файла в БД:', err.message);
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
        { name: 'Все файлы', extensions: ['*'] },
        { name: 'Изображения', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Видео', extensions: ['mp4', 'avi'] },
        { name: 'Документы', extensions: ['pdf', 'doc', 'docx'] },
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

  // IPC-обработчики для шаблонов
  ipcMain.handle('add-template', async (event, template) => {
    return new Promise((resolve, reject) => {
      addTemplate(template.templateName, template.templateText, template.description, (err, id) => {
        if (err) {
          reject(err);
        } else {
          resolve(id);
        }
      });
    });
  });

  ipcMain.handle('get-templates', async () => {
    return new Promise((resolve, reject) => {
      getTemplates((err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('update-template', async (event, id, { templateName, templateText, description }) => {
    return new Promise((resolve, reject) => {
      updateTemplate(id, templateName, templateText, description, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  ipcMain.handle('delete-template', async (event, id) => {
    return new Promise((resolve, reject) => {
      deleteTemplate(id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  ipcMain.handle('add-post-template', async (event, postId, templateId) => {
    return new Promise((resolve, reject) => {
      addPostTemplate(postId, templateId, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  ipcMain.handle('get-post-templates', async (event, postId) => {
    return new Promise((resolve, reject) => {
      getPostTemplates(postId, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('remove-post-template', async (event, postId, templateId) => {
    return new Promise((resolve, reject) => {
      removePostTemplate(postId, templateId, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  // IPC-обработчики для групп постов
  ipcMain.handle('add-post-group', async (event, title, groupDescription) => {
    return new Promise((resolve, reject) => {
      addPostGroup(title, groupDescription, (err, id) => {
        if (err) {
          reject(err);
        } else {
          resolve(id);
        }
      });
    });
  });

  ipcMain.handle('get-post-groups', async () => {
    return new Promise((resolve, reject) => {
      getPostGroups((err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('update-post-group', async (event, id, title, groupDescription) => {
    return new Promise((resolve, reject) => {
      updatePostGroup(id, title, groupDescription, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  ipcMain.handle('delete-post-group', async (event, id) => {
    return new Promise((resolve, reject) => {
      deletePostGroup(id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  // IPC-обработчики для групп свойств
  ipcMain.handle('add-property-group', async (event, groupName, groupDescription) => {
    return new Promise((resolve, reject) => {
      addPropertyGroup(groupName, groupDescription, (err, id) => {
        if (err) {
          reject(err);
        } else {
          resolve(id);
        }
      });
    });
  });

  ipcMain.handle('get-property-groups', async () => {
    return new Promise((resolve, reject) => {
      getPropertyGroups((err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('update-property-group', async (event, id, groupName, groupDescription) => {
    return new Promise((resolve, reject) => {
      updatePropertyGroup(id, groupName, groupDescription, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  ipcMain.handle('delete-property-group', async (event, id) => {
    return new Promise((resolve, reject) => {
      deletePropertyGroup(id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  // IPC-обработчики для значений свойств
  ipcMain.handle('add-property-value', async (event, groupId, propertyName, valueType, propertyValue) => {
    return new Promise((resolve, reject) => {
      addPropertyValue(groupId, propertyName, valueType, propertyValue, (err, id) => {
        if (err) {
          reject(err);
        } else {
          resolve(id);
        }
      });
    });
  });

  ipcMain.handle('get-property-values', async (event, groupId) => {
    return new Promise((resolve, reject) => {
      getPropertyValues(groupId, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('update-property-value', async (event, id, propertyName, valueType, propertyValue) => {
    return new Promise((resolve, reject) => {
      updatePropertyValue(id, propertyName, valueType, propertyValue, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  ipcMain.handle('delete-property-value', async (event, id) => {
    return new Promise((resolve, reject) => {
      deletePropertyValue(id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  // IPC-обработчики для свойств постов
  ipcMain.handle('add-post-property', async (event, postId, valueId) => {
    return new Promise((resolve, reject) => {
      addPostProperty(postId, valueId, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  ipcMain.handle('get-post-properties', async (event, postId) => {
    return new Promise((resolve, reject) => {
      getPostProperties(postId, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('remove-post-property', async (event, postId, valueId) => {
    return new Promise((resolve, reject) => {
      removePostProperty(postId, valueId, (err) => {
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
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addPost: (post) => ipcRenderer.invoke('add-post', post),
  getPosts: () => ipcRenderer.invoke('get-posts'),
  updatePost: (id, post) => ipcRenderer.invoke('update-post', id, post),
  deletePost: (id) => ipcRenderer.invoke('delete-post', id),
  addAttachedFile: (postId, filePath, fileName, fileType) => ipcRenderer.invoke('add-attached-file', postId, filePath, fileName, fileType),
  getAttachedFiles: (postId) => ipcRenderer.invoke('get-attached-files', postId),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
});

ipcRenderer.on('file-dialog-response', (event, files) => {
  console.log('Selected files:', files);
});
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addPost: (post) => ipcRenderer.invoke('add-post', post),
  getPosts: () => ipcRenderer.invoke('get-posts'),
  updatePost: (id, post) => ipcRenderer.invoke('update-post', { id, ...post }),
  deletePost: (id) => ipcRenderer.invoke('delete-post', id),
});
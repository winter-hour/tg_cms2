const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addPost: (groupId, channelId, userId, title, text, isPublished, publishedAt) =>
    ipcRenderer.invoke('add-post', groupId, channelId, userId, title, text, isPublished, publishedAt),
  getPosts: () => ipcRenderer.invoke('get-posts'),
  updatePost: (id, groupId, channelId, userId, title, text, isPublished, publishedAt) =>
    ipcRenderer.invoke('update-post', id, groupId, channelId, userId, title, text, isPublished, publishedAt),
  deletePost: (id) => ipcRenderer.invoke('delete-post', id),
  addAttachedFile: (postId, filePath, fileName, fileType) =>
    ipcRenderer.invoke('add-attached-file', postId, filePath, fileName, fileType),
  getAttachedFiles: (postId) => ipcRenderer.invoke('get-attached-files', postId),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  addTemplate: (template) => ipcRenderer.invoke('add-template', template),
  getTemplates: () => ipcRenderer.invoke('get-templates'),
  updateTemplate: (id, template) => ipcRenderer.invoke('update-template', id, template),
  deleteTemplate: (id) => ipcRenderer.invoke('delete-template', id),
  addPostTemplate: (postId, templateId) => ipcRenderer.invoke('add-post-template', postId, templateId),
  getPostTemplates: (postId) => ipcRenderer.invoke('get-post-templates', postId),
  removePostTemplate: (postId, templateId) => ipcRenderer.invoke('remove-post-template', postId, templateId),
  addPostGroup: (title, groupDescription) => ipcRenderer.invoke('add-post-group', title, groupDescription),
  getPostGroups: () => ipcRenderer.invoke('get-post-groups'),
  updatePostGroup: (id, title, groupDescription) => ipcRenderer.invoke('update-post-group', id, title, groupDescription),
  deletePostGroup: (id) => ipcRenderer.invoke('delete-post-group', id),
});

ipcRenderer.on('file-dialog-response', (event, files) => {
  console.log('Selected files:', files);
});
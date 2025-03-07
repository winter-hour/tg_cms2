const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

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
  addPropertyGroup: (groupName, groupDescription) => ipcRenderer.invoke('add-property-group', groupName, groupDescription),
  getPropertyGroups: () => ipcRenderer.invoke('get-property-groups'),
  updatePropertyGroup: (id, groupName, groupDescription) => ipcRenderer.invoke('update-property-group', id, groupName, groupDescription),
  deletePropertyGroup: (id) => ipcRenderer.invoke('delete-property-group', id),
  addPropertyValue: (groupId, propertyName, valueType, propertyValue) =>
    ipcRenderer.invoke('add-property-value', groupId, propertyName, valueType, propertyValue),
  getPropertyValues: (groupId) => ipcRenderer.invoke('get-property-values', groupId),
  updatePropertyValue: (id, propertyName, valueType, propertyValue) =>
    ipcRenderer.invoke('update-property-value', id, propertyName, valueType, propertyValue),
  deletePropertyValue: (id) => ipcRenderer.invoke('delete-property-value', id),
  addPostProperty: (postId, valueId) => ipcRenderer.invoke('add-post-property', postId, valueId),
  getPostProperties: (postId) => ipcRenderer.invoke('get-post-properties', postId),
  removePostProperty: (postId, valueId) => ipcRenderer.invoke('remove-post-property', postId, valueId),
});

ipcRenderer.on('file-dialog-response', (event, files) => {
  console.log('Selected files:', files);
});
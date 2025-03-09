// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField, // Добавляем обратно
  FormControl, // Добавляем обратно
  InputLabel, // Добавляем обратно
  Select, // Добавляем обратно
  MenuItem, // Добавляем обратно
  Checkbox, // Добавляем обратно
} from '@mui/material';
import theme from './theme';
import Sidebar from './components/Sidebar';
import TitleBar from './components/TitleBar';
import InfoBar from './components/InfoBar';
import PostsTab from './components/PostsTab';
import PostGroupsTab from './components/PostGroupsTab';
import TemplatesTab from './components/TemplatesTab';
import PropertiesTab from './components/PropertiesTab';

function App() {
  const [selectedTab, setSelectedTab] = useState('posts');

  // Состояние для постов
  const [posts, setPosts] = useState([]);
  const [postGroups, setPostGroups] = useState([]);
  const [newPostGroupId, setNewPostGroupId] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [editPost, setEditPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedProperties, setSelectedProperties] = useState([]);

  // Состояние для шаблонов
  const [templates, setTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateText, setNewTemplateText] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [editTemplate, setEditTemplate] = useState(null);
  const [editTemplateName, setEditTemplateName] = useState('');
  const [editTemplateText, setEditTemplateText] = useState('');
  const [editTemplateDescription, setEditTemplateDescription] = useState('');

  // Состояние для групп
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [editGroup, setEditGroup] = useState(null);
  const [editGroupTitle, setEditGroupTitle] = useState('');
  const [editGroupDescription, setEditGroupDescription] = useState('');

  // Состояние для групп свойств
  const [propertyGroups, setPropertyGroups] = useState([]);
  const [selectedPropertyGroupId, setSelectedPropertyGroupId] = useState('');
  const [newPropertyGroupName, setNewPropertyGroupName] = useState('');
  const [newPropertyGroupDescription, setNewPropertyGroupDescription] = useState('');
  const [editPropertyGroup, setEditPropertyGroup] = useState(null);
  const [editPropertyGroupName, setEditPropertyGroupName] = useState('');
  const [editPropertyGroupDescription, setEditPropertyGroupDescription] = useState('');

  // Состояние для значений свойств
  const [propertyValues, setPropertyValues] = useState([]);
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newValueType, setNewValueType] = useState('text');
  const [newPropertyValue, setNewPropertyValue] = useState('');
  const [editPropertyValue, setEditPropertyValue] = useState(null);
  const [editPropertyName, setEditPropertyName] = useState('');
  const [editValueType, setEditValueType] = useState('text');
  const [editPropertyValueText, setEditPropertyValueText] = useState('');

  const editButtonRef = useRef(null);

  useEffect(() => {
    fetchPosts();
    fetchTemplates();
    fetchPostGroups();
    fetchPropertyGroups();
    if (selectedPropertyGroupId) fetchPropertyValues(selectedPropertyGroupId);
  }, [selectedPropertyGroupId]);

  const fetchPosts = async () => {
    try {
      const postsData = await window.electronAPI.getPosts();
      const postsWithFilesAndTemplates = await Promise.all(
        postsData.map(async (post) => {
          const files = await window.electronAPI.getAttachedFiles(post.id);
          const templates = await window.electronAPI.getPostTemplates(post.id);
          const properties = await window.electronAPI.getPostProperties(post.id);
          return { ...post, attachedFiles: files, templates, properties };
        })
      );
      setPosts(postsWithFilesAndTemplates);
      console.log('Posts fetched:', postsWithFilesAndTemplates);
    } catch (err) {
      console.error('Ошибка загрузки постов:', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const templatesData = await window.electronAPI.getTemplates();
      setTemplates(templatesData);
      console.log('Templates fetched:', templatesData);
    } catch (err) {
      console.error('Ошибка загрузки шаблонов:', err);
    }
  };

  const fetchPostGroups = async () => {
    try {
      const groupsData = await window.electronAPI.getPostGroups();
      setPostGroups(groupsData);
      console.log('Post groups fetched:', groupsData);
    } catch (err) {
      console.error('Ошибка загрузки групп:', err);
    }
  };

  const fetchPropertyGroups = async () => {
    try {
      const groupsData = await window.electronAPI.getPropertyGroups();
      setPropertyGroups(groupsData);
      console.log('Property groups fetched:', groupsData);
    } catch (err) {
      console.error('Ошибка загрузки групп свойств:', err);
    }
  };

  const fetchPropertyValues = async (groupId) => {
    try {
      const valuesData = await window.electronAPI.getPropertyValues(groupId);
      setPropertyValues(valuesData);
      console.log('Property values fetched:', valuesData);
    } catch (err) {
      console.error('Ошибка загрузки значений свойств:', err);
    }
  };

  const handleAddPost = async () => {
    if (!newPostText) return;

    const post = {
      groupId: newPostGroupId || null,
      channelId: 1,
      userId: 1,
      title: newPostTitle,
      text: newPostText,
      isPublished: false,
      publishedAt: null,
    };

    try {
      const postId = await window.electronAPI.addPost(
        post.groupId,
        post.channelId,
        post.userId,
        post.title,
        post.text,
        post.isPublished,
        post.publishedAt
      );
      if (selectedTemplate) {
        await window.electronAPI.addPostTemplate(postId, selectedTemplate);
      }
      for (const file of selectedFiles) {
        if (!file.path) {
          console.error('File path is undefined:', file);
          continue;
        }
        const fileType = file.path.split('.').pop().toLowerCase();
        await window.electronAPI.addAttachedFile(postId, file.path, file.name, fileType);
      }
      for (const valueId of selectedProperties) {
        await window.electronAPI.addPostProperty(postId, valueId);
      }
      await fetchPosts();
      setNewPostTitle('');
      setNewPostText('');
      setSelectedFiles([]);
      setSelectedTemplate('');
      setNewPostGroupId('');
      setSelectedProperties([]);
    } catch (err) {
      console.error('Ошибка добавления поста или файлов:', err);
    }
  };

  const handleFileDialog = async () => {
    const files = await window.electronAPI.openFileDialog();
    console.log('Selected files:', files);
    setSelectedFiles(files);
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setEditTitle(post.title || '');
    setEditText(post.text || '');
    setSelectedProperties(post.properties ? post.properties.map((p) => p.id) : []);
  };

  const handleSaveEdit = async () => {
    if (!editText || !editPost) return;

    const updatedPost = {
      groupId: editPost.group_id || null,
      channelId: editPost.channel_id || 1,
      userId: editPost.user_id || 1,
      title: editTitle,
      text: editText,
      isPublished: editPost.is_published || false,
      publishedAt: editPost.published_at || null,
    };

    try {
      await window.electronAPI.updatePost(
        editPost.id,
        updatedPost.groupId,
        updatedPost.channelId,
        updatedPost.userId,
        updatedPost.title,
        updatedPost.text,
        updatedPost.isPublished,
        updatedPost.publishedAt
      );
      const currentProperties = editPost.properties ? editPost.properties.map((p) => p.id) : [];
      const propertiesToRemove = currentProperties.filter((id) => !selectedProperties.includes(id));
      const propertiesToAdd = selectedProperties.filter((id) => !currentProperties.includes(id));
      for (const id of propertiesToRemove) {
        await window.electronAPI.removePostProperty(editPost.id, id);
      }
      for (const id of propertiesToAdd) {
        await window.electronAPI.addPostProperty(editPost.id, id);
      }
      await fetchPosts();
      setEditPost(null);
      setEditTitle('');
      setEditText('');
      setSelectedProperties([]);
    } catch (err) {
      console.error('Ошибка редактирования поста:', err);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await window.electronAPI.deletePost(id);
      await fetchPosts();
    } catch (err) {
      console.error('Ошибка удаления поста:', err);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplateName || !newTemplateText) return;

    const template = {
      templateName: newTemplateName,
      templateText: newTemplateText,
      description: newTemplateDescription,
    };

    try {
      await window.electronAPI.addTemplate(template);
      await fetchTemplates();
      setNewTemplateName('');
      setNewTemplateText('');
      setNewTemplateDescription('');
    } catch (err) {
      console.error('Ошибка добавления шаблона:', err);
    }
  };

  const handleEditTemplate = (template) => {
    setEditTemplate(template);
    setEditTemplateName(template.template_name);
    setEditTemplateText(template.template_text);
    setEditTemplateDescription(template.description || '');
  };

  const handleSaveEditTemplate = async () => {
    if (!editTemplateName || !editTemplateText || !editTemplate) return;

    const updatedTemplate = {
      templateName: editTemplateName,
      templateText: editTemplateText,
      description: editTemplateDescription,
    };

    try {
      await window.electronAPI.updateTemplate(editTemplate.id, updatedTemplate);
      await fetchTemplates();
      setEditTemplate(null);
      setEditTemplateName('');
      setEditTemplateText('');
      setEditTemplateDescription('');
    } catch (err) {
      console.error('Ошибка редактирования шаблона:', err);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await window.electronAPI.deleteTemplate(id);
      await fetchTemplates();
    } catch (err) {
      console.error('Ошибка удаления шаблона:', err);
    }
  };

  const handleApplyTemplate = (templateText) => {
    setNewPostText((prev) => prev + (prev ? '\n' : '') + templateText);
  };

  const handleAddPostGroup = async () => {
    if (!newGroupTitle) return;

    try {
      await window.electronAPI.addPostGroup(newGroupTitle, newGroupDescription);
      await fetchPostGroups();
      setNewGroupTitle('');
      setNewGroupDescription('');
    } catch (err) {
      console.error('Ошибка добавления группы:', err);
    }
  };

  const handleEditPostGroup = (group) => {
    setEditGroup(group);
    setEditGroupTitle(group.title);
    setEditGroupDescription(group.group_description || '');
  };

  const handleSaveEditPostGroup = async () => {
    if (!editGroupTitle || !editGroup) return;

    try {
      await window.electronAPI.updatePostGroup(editGroup.id, editGroupTitle, editGroupDescription);
      await fetchPostGroups();
      setEditGroup(null);
      setEditGroupTitle('');
      setEditGroupDescription('');
    } catch (err) {
      console.error('Ошибка редактирования группы:', err);
    }
  };

  const handleDeletePostGroup = async (id) => {
    try {
      await window.electronAPI.deletePostGroup(id);
      await fetchPostGroups();
    } catch (err) {
      console.error('Ошибка удаления группы:', err);
    }
  };

  const handleAddPropertyGroup = async () => {
    if (!newPropertyGroupName) return;

    try {
      await window.electronAPI.addPropertyGroup(newPropertyGroupName, newPropertyGroupDescription);
      await fetchPropertyGroups();
      setNewPropertyGroupName('');
      setNewPropertyGroupDescription('');
    } catch (err) {
      console.error('Ошибка добавления группы свойств:', err);
    }
  };

  const handleEditPropertyGroup = (group) => {
    setEditPropertyGroup(group);
    setEditPropertyGroupName(group.group_name);
    setEditPropertyGroupDescription(group.group_description || '');
  };

  const handleSaveEditPropertyGroup = async () => {
    if (!editPropertyGroupName || !editPropertyGroup) return;

    try {
      await window.electronAPI.updatePropertyGroup(
        editPropertyGroup.id,
        editPropertyGroupName,
        editPropertyGroupDescription
      );
      await fetchPropertyGroups();
      setEditPropertyGroup(null);
      setEditPropertyGroupName('');
      setEditPropertyGroupDescription('');
    } catch (err) {
      console.error('Ошибка редактирования группы свойств:', err);
    }
  };

  const handleDeletePropertyGroup = async (id) => {
    try {
      await window.electronAPI.deletePropertyGroup(id);
      await fetchPropertyGroups();
      setSelectedPropertyGroupId('');
      setPropertyValues([]);
    } catch (err) {
      console.error('Ошибка удаления группы свойств:', err);
    }
  };

  const handleAddPropertyValue = async () => {
    if (!newPropertyName || !newPropertyValue) return;

    try {
      await window.electronAPI.addPropertyValue(
        selectedPropertyGroupId,
        newPropertyName,
        newValueType,
        newPropertyValue
      );
      await fetchPropertyValues(selectedPropertyGroupId);
      setNewPropertyName('');
      setNewValueType('text');
      setNewPropertyValue('');
    } catch (err) {
      console.error('Ошибка добавления значения свойства:', err);
    }
  };

  const handleEditPropertyValue = (value) => {
    setEditPropertyValue(value);
    setEditPropertyName(value.property_name);
    setEditValueType(value.value_type);
    setEditPropertyValueText(value.property_value);
  };

  const handleSaveEditPropertyValue = async () => {
    if (!editPropertyName || !editPropertyValueText || !editPropertyValue) return;

    try {
      await window.electronAPI.updatePropertyValue(
        editPropertyValue.id,
        editPropertyName,
        editValueType,
        editPropertyValueText
      );
      await fetchPropertyValues(selectedPropertyGroupId);
      setEditPropertyValue(null);
      setEditPropertyName('');
      setEditValueType('text');
      setEditPropertyValueText('');
    } catch (err) {
      console.error('Ошибка редактирования значения свойства:', err);
    }
  };

  const handleDeletePropertyValue = async (id) => {
    try {
      await window.electronAPI.deletePropertyValue(id);
      await fetchPropertyValues(selectedPropertyGroupId);
    } catch (err) {
      console.error('Ошибка удаления значения свойства:', err);
    }
  };

  const handleDialogClose = () => {
    setEditPost(null);
    setEditTitle('');
    setEditText('');
    setSelectedProperties([]);
    if (editButtonRef.current) editButtonRef.current.focus();
  };

  const handleGroupDialogClose = () => {
    setEditGroup(null);
    setEditGroupTitle('');
    setEditGroupDescription('');
  };

  const handlePropertyGroupDialogClose = () => {
    setEditPropertyGroup(null);
    setEditPropertyGroupName('');
    setEditPropertyGroupDescription('');
  };

  const handlePropertyValueDialogClose = () => {
    setEditPropertyValue(null);
    setEditPropertyName('');
    setEditValueType('text');
    setEditPropertyValueText('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TitleBar />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: 'auto',
            height: '100vh',
            paddingBottom: '40px',
            marginLeft: '56px',
            marginTop: '32px',
          }}
        >
          {selectedTab === 'posts' && (
            <PostsTab
              posts={posts}
              postGroups={postGroups}
              templates={templates}
              propertyValues={propertyValues}
              newPostTitle={newPostTitle}
              setNewPostTitle={setNewPostTitle}
              newPostText={newPostText}
              setNewPostText={setNewPostText}
              newPostGroupId={newPostGroupId}
              setNewPostGroupId={setNewPostGroupId}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectedProperties={selectedProperties}
              setSelectedProperties={setSelectedProperties}
              handleAddPost={handleAddPost}
              handleFileDialog={handleFileDialog}
              handleEditPost={handleEditPost}
              handleDeletePost={handleDeletePost}
              handleApplyTemplate={handleApplyTemplate}
            />
          )}
          {selectedTab === 'groups' && (
            <PostGroupsTab
              postGroups={postGroups}
              newGroupTitle={newGroupTitle}
              setNewGroupTitle={setNewGroupTitle}
              newGroupDescription={newGroupDescription}
              setNewGroupDescription={setNewGroupDescription}
              handleAddPostGroup={handleAddPostGroup}
              handleEditPostGroup={handleEditPostGroup}
              handleDeletePostGroup={handleDeletePostGroup}
            />
          )}
          {selectedTab === 'templates' && (
            <TemplatesTab
              templates={templates}
              newTemplateName={newTemplateName}
              setNewTemplateName={setNewTemplateName}
              newTemplateText={newTemplateText}
              setNewTemplateText={setNewTemplateText}
              newTemplateDescription={newTemplateDescription}
              setNewTemplateDescription={setNewTemplateDescription}
              handleAddTemplate={handleAddTemplate}
              handleEditTemplate={handleEditTemplate}
              handleDeleteTemplate={handleDeleteTemplate}
            />
          )}
          {selectedTab === 'properties' && (
            <PropertiesTab
              propertyGroups={propertyGroups}
              propertyValues={propertyValues}
              selectedPropertyGroupId={selectedPropertyGroupId}
              setSelectedPropertyGroupId={setSelectedPropertyGroupId}
              newPropertyGroupName={newPropertyGroupName}
              setNewPropertyGroupName={setNewPropertyGroupName}
              newPropertyGroupDescription={newPropertyGroupDescription}
              setNewPropertyGroupDescription={setNewPropertyGroupDescription}
              newPropertyName={newPropertyName}
              setNewPropertyName={setNewPropertyName}
              newValueType={newValueType}
              setNewValueType={setNewValueType}
              newPropertyValue={newPropertyValue}
              setNewPropertyValue={setNewPropertyValue}
              handleAddPropertyGroup={handleAddPropertyGroup}
              handleEditPropertyGroup={handleEditPropertyGroup}
              handleDeletePropertyGroup={handleDeletePropertyGroup}
              handleAddPropertyValue={handleAddPropertyValue}
              handleEditPropertyValue={handleEditPropertyValue}
              handleDeletePropertyValue={handleDeletePropertyValue}
            />
          )}
        </Box>
      </Box>

      <InfoBar status="Подключено" postCount={posts.length} />

      {/* Диалоги */}
      <Dialog open={!!editPost} onClose={handleDialogClose} disableRestoreFocus>
        <DialogTitle>Редактировать пост</DialogTitle>
        <DialogContent>
          <TextField
            label="Заголовок поста"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Текст поста"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={5}
            autoFocus
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Выберите группу</InputLabel>
            <Select
              value={editPost?.group_id || ''}
              onChange={(e) => setEditPost({ ...editPost, group_id: e.target.value || null })}
            >
              <MenuItem value="">Без группы</MenuItem>
              {postGroups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Выберите свойства</InputLabel>
            <Select
              multiple
              value={selectedProperties}
              onChange={(e) => setSelectedProperties(e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const value = propertyValues.find((v) => v.id === id);
                    return value ? `${value.property_name}: ${value.property_value}` : '';
                  })
                  .join(', ')
              }
            >
              {propertyValues.map((value) => (
                <MenuItem key={value.id} value={value.id}>
                  <Checkbox checked={selectedProperties.indexOf(value.id) > -1} />
                  {`${value.property_name}: ${value.property_value} (${value.value_type})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editTemplate} onClose={() => setEditTemplate(null)} disableRestoreFocus>
        <DialogTitle>Редактировать шаблон</DialogTitle>
        <DialogContent>
          <TextField
            label="Название шаблона"
            value={editTemplateName}
            onChange={(e) => setEditTemplateName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Текст шаблона"
            value={editTemplateText}
            onChange={(e) => setEditTemplateText(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Описание шаблона"
            value={editTemplateDescription}
            onChange={(e) => setEditTemplateDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTemplate(null)}>Отмена</Button>
          <Button onClick={handleSaveEditTemplate} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editGroup} onClose={handleGroupDialogClose} disableRestoreFocus>
        <DialogTitle>Редактировать группу</DialogTitle>
        <DialogContent>
          <TextField
            label="Название группы"
            value={editGroupTitle}
            onChange={(e) => setEditGroupTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Описание группы"
            value={editGroupDescription}
            onChange={(e) => setEditGroupDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGroupDialogClose}>Отмена</Button>
          <Button onClick={handleSaveEditPostGroup} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editPropertyGroup} onClose={handlePropertyGroupDialogClose} disableRestoreFocus>
        <DialogTitle>Редактировать группу свойств</DialogTitle>
        <DialogContent>
          <TextField
            label="Название группы свойств"
            value={editPropertyGroupName}
            onChange={(e) => setEditPropertyGroupName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Описание группы свойств"
            value={editPropertyGroupDescription}
            onChange={(e) => setEditPropertyGroupDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePropertyGroupDialogClose}>Отмена</Button>
          <Button onClick={handleSaveEditPropertyGroup} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editPropertyValue} onClose={handlePropertyValueDialogClose} disableRestoreFocus>
        <DialogTitle>Редактировать значение свойства</DialogTitle>
        <DialogContent>
          <TextField
            label="Название свойства"
            value={editPropertyName}
            onChange={(e) => setEditPropertyName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Тип значения</InputLabel>
            <Select value={editValueType} onChange={(e) => setEditValueType(e.target.value)}>
              <MenuItem value="text">Текст</MenuItem>
              <MenuItem value="number">Число</MenuItem>
              <MenuItem value="date">Дата</MenuItem>
              <MenuItem value="boolean">Логическое</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Значение свойства"
            value={editPropertyValueText}
            onChange={(e) => setEditPropertyValueText(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePropertyValueDialogClose}>Отмена</Button>
          <Button onClick={handleSaveEditPropertyValue} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
import { useState, useEffect, useRef } from 'react';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

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

  const editButtonRef = useRef(null);

  useEffect(() => {
    fetchPosts();
    fetchTemplates();
    fetchPostGroups();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await window.electronAPI.getPosts();
      const postsWithFilesAndTemplates = await Promise.all(
        postsData.map(async (post) => {
          const files = await window.electronAPI.getAttachedFiles(post.id);
          const templates = await window.electronAPI.getPostTemplates(post.id);
          return { ...post, attachedFiles: files, templates };
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

  const handleAddPost = async () => {
    if (!newPostText) return;

    const post = {
      groupId: newPostGroupId || null,
      channelId: 1, // Заглушка
      userId: 1, // Заглушка
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
      await fetchPosts();
      setNewPostTitle('');
      setNewPostText('');
      setSelectedFiles([]);
      setSelectedTemplate('');
      setNewPostGroupId('');
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
      await fetchPosts();
      setEditPost(null);
      setEditTitle('');
      setEditText('');
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDialogClose = () => {
    setEditPost(null);
    setEditTitle('');
    setEditText('');
    if (editButtonRef.current) {
      editButtonRef.current.focus();
    }
  };

  const handleGroupDialogClose = () => {
    setEditGroup(null);
    setEditGroupTitle('');
    setEditGroupDescription('');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Telegram CMS
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Посты" />
        <Tab label="Шаблоны" />
        <Tab label="Группы" />
      </Tabs>

      {/* Вкладка Посты */}
      <TabPanel value={tabValue} index={0}>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Заголовок поста"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Текст поста"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Выберите группу</InputLabel>
            <Select
              value={newPostGroupId}
              onChange={(e) => setNewPostGroupId(e.target.value)}
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
            <InputLabel>Выберите шаблон</InputLabel>
            <Select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
                const template = templates.find(t => t.id === e.target.value);
                if (template) {
                  handleApplyTemplate(template.template_text);
                }
              }}
            >
              <MenuItem value="">Нет шаблона</MenuItem>
              {templates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.template_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleFileDialog} style={{ margin: '10px 0' }}>
            Выбрать файлы
          </Button>
          <div>
            {selectedFiles.map((file, index) => (
              <div key={index}>{file.name}</div>
            ))}
          </div>
          <Button variant="contained" onClick={handleAddPost}>
            Добавить пост
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Заголовок</TableCell>
              <TableCell>Текст</TableCell>
              <TableCell>Группа</TableCell>
              <TableCell>Опубликовано</TableCell>
              <TableCell>Дата публикации</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Прикреплённые файлы</TableCell>
              <TableCell>Шаблоны</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title || '-'}</TableCell>
                <TableCell>{post.text}</TableCell>
                <TableCell>
                  {post.group_id ? postGroups.find(g => g.id === post.group_id)?.title || 'Неизвестно' : '-'}
                </TableCell>
                <TableCell>{post.is_published ? 'Да' : 'Нет'}</TableCell>
                <TableCell>{post.published_at || '-'}</TableCell>
                <TableCell>{post.created_at}</TableCell>
                <TableCell>
                  {post.attachedFiles && post.attachedFiles.length > 0 ? (
                    post.attachedFiles.map((file) => (
                      <div key={file.id}>{file.file_path}</div>
                    ))
                  ) : (
                    'Нет файлов'
                  )}
                </TableCell>
                <TableCell>
                  {post.templates && post.templates.length > 0 ? (
                    post.templates.map((template) => (
                      <div key={template.id}>{template.template_name}</div>
                    ))
                  ) : (
                    'Нет шаблонов'
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditPost(post)}
                    style={{ marginRight: '10px' }}
                    ref={(el) => {
                      if (editPost?.id === post.id) editButtonRef.current = el;
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabPanel>

      {/* Вкладка Шаблоны */}
      <TabPanel value={tabValue} index={1}>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Название шаблона"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Текст шаблона"
            value={newTemplateText}
            onChange={(e) => setNewTemplateText(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Описание шаблона"
            value={newTemplateDescription}
            onChange={(e) => setNewTemplateDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleAddTemplate}>
            Добавить шаблон
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Текст</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Дата обновления</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>{template.id}</TableCell>
                <TableCell>{template.template_name}</TableCell>
                <TableCell>{template.template_text}</TableCell>
                <TableCell>{template.description || '-'}</TableCell>
                <TableCell>{template.created_at}</TableCell>
                <TableCell>{template.updated_at}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditTemplate(template)}
                    style={{ marginRight: '10px' }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabPanel>

      {/* Вкладка Группы */}
      <TabPanel value={tabValue} index={2}>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Название группы"
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Описание группы"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <Button variant="contained" onClick={handleAddPostGroup} style={{ marginTop: '10px' }}>
            Добавить группу
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Дата обновления</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.id}</TableCell>
                <TableCell>{group.title}</TableCell>
                <TableCell>{group.group_description || '-'}</TableCell>
                <TableCell>{group.created_at}</TableCell>
                <TableCell>{group.updated_at}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditPostGroup(group)}
                    style={{ marginRight: '10px' }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeletePostGroup(group.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabPanel>

      {/* Диалог редактирования поста */}
      <Dialog
        open={!!editPost}
        onClose={handleDialogClose}
        disableRestoreFocus
      >
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
            rows={4}
            autoFocus
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Выберите группу</InputLabel>
            <Select
              value={editPost?.group_id || ''}
              onChange={(e) => {
                setEditPost({ ...editPost, group_id: e.target.value || null });
              }}
            >
              <MenuItem value="">Без группы</MenuItem>
              {postGroups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.title}
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

      {/* Диалог редактирования шаблона */}
      <Dialog
        open={!!editTemplate}
        onClose={() => setEditTemplate(null)}
        disableRestoreFocus
      >
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

      {/* Диалог редактирования группы */}
      <Dialog
        open={!!editGroup}
        onClose={handleGroupDialogClose}
        disableRestoreFocus
      >
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
    </Container>
  );
}

export default App;
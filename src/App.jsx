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

  const editButtonRef = useRef(null);

  useEffect(() => {
    fetchPosts();
    fetchTemplates();
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

  const handleAddPost = async () => {
    if (!newPostText) return;

    const post = {
      groupId: 1, // Заглушка, пока нет групп
      channelId: 1, // Заглушка, пока нет каналов
      userId: 1, // Заглушка, пока нет пользователей
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchPosts();
      setNewPostTitle('');
      setNewPostText('');
      setSelectedFiles([]);
      setSelectedTemplate('');
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
      groupId: editPost.group_id || 1,
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Telegram CMS
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Посты" />
        <Tab label="Шаблоны" />
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
    </Container>
  );
}

export default App;
import { useState, useEffect, useRef } from 'react';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Description as DescriptionIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles'; // Добавляем импорт ThemeProvider
import theme from './theme'; // Импортируем тему из src/theme.js
import TitleBar from './components/TitleBar';
import InfoBar from './components/InfoBar'; // Инфобар снизу

function App() {
  const [selectedTab, setSelectedTab] = useState('posts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Состояние для раскрытия/сворачивания

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

  // Константы для цветов
  const ICON_COLOR_INACTIVE = '#8e8e8e'; // Цвет иконок в неактивном состоянии
  const ICON_COLOR_ACTIVE = '#3b3b3b';   // Цвет иконок в активном состоянии
  const ICON_COLOR_HOVER = '#1a1a1a';    // Цвет иконок при наведении

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
    setSelectedProperties(post.properties ? post.properties.map(p => p.id) : []);
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
      const currentProperties = editPost.properties ? editPost.properties.map(p => p.id) : [];
      const propertiesToRemove = currentProperties.filter(id => !selectedProperties.includes(id));
      const propertiesToAdd = selectedProperties.filter(id => !currentProperties.includes(id));
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
      await window.electronAPI.updatePropertyGroup(editPropertyGroup.id, editPropertyGroupName, editPropertyGroupDescription);
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
      await window.electronAPI.addPropertyValue(selectedPropertyGroupId, newPropertyName, newValueType, newPropertyValue);
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
      await window.electronAPI.updatePropertyValue(editPropertyValue.id, editPropertyName, editValueType, editPropertyValueText);
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
    if (editButtonRef.current) {
      editButtonRef.current.focus();
    }
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

  // Вкладки для бокового меню
  const tabs = [
    { id: 'posts', label: 'Посты', icon: <ArticleIcon /> },
    { id: 'templates', label: 'Шаблоны', icon: <DescriptionIcon /> },
    { id: 'groups', label: 'Группы', icon: <GroupIcon /> },
    { id: 'properties', label: 'Свойства', icon: <SettingsIcon /> },
  ];

  // Фиксированные размеры боковой панели
  const SIDEBAR_CLOSED_WIDTH = 56; // Ширина в закрытом состоянии (стандарт для иконок Material UI)
  const SIDEBAR_OPEN_WIDTH = 140; // Ширина в раскрытом состоянии
  const SIDEBAR_MARGIN = 10; // Минимальный отступ слева для содержимого
  const TITLE_BAR_HEIGHT = 32; // Высота титульной панели

  return (
    <ThemeProvider theme={theme}> {/* Оборачиваем всё в ThemeProvider */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          overflow: 'hidden', // Убираем скролл на уровне корневого контейнера
        }}
      >
        {/* Кастомная титульная панель */}
        <TitleBar />

        {/* Боковая панель (фиксированная) */}
        <Box
          sx={{
            width: isSidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH,
            bgcolor: '#f5f5f5',
            borderRight: '1px solid #ddd',
            height: `calc(100vh - ${TITLE_BAR_HEIGHT}px)`, // Учитываем высоту титульной панели
            overflow: 'auto', // Скролл только внутри боковой панели
            transition: 'width 0.3s', // Плавное переключение ширины
            ml: 0,
            p: 0,
            mt: `${TITLE_BAR_HEIGHT}px`, // Сдвигаем вниз на высоту титульной панели
            position: 'fixed', // Фиксируем панель
            zIndex: 1000, // Убеждаемся, что панель поверх содержимого
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Для размещения кнопки внизу
          }}
        >
          {/* Меню */}
          <List>
            {tabs.map((tab) => (
              <ListItem
                key={tab.id}
                button
                onClick={() => setSelectedTab(tab.id)}
                sx={{
                  p: 1,
                  minHeight: 48,
                  justifyContent: isSidebarOpen ? 'initial' : 'center',
                  cursor: 'pointer', // Курсор в виде руки для всего элемента
                  '&:hover': {
                    bgcolor: 'transparent', // Убираем изменение фона
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: ICON_COLOR_HOVER, // Единое изменение цвета для иконки и текста
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isSidebarOpen ? 1 : 0,
                    color: selectedTab === tab.id ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE, // Цвет иконок
                  }}
                >
                  {tab.icon}
                </ListItemIcon>
                {isSidebarOpen && (
                  <ListItemText
                    primary={tab.label}
                    sx={{
                      color: selectedTab === tab.id ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE, // Цвет текста
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>

          {/* Кнопка для раскрытия/сворачивания внизу */}
          <Box sx={{ p: 1 }}>
            <ListItem
              button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              sx={{
                p: 1,
                minHeight: 80,
                justifyContent: isSidebarOpen ? 'initial' : 'center',
                cursor: 'pointer', // Курсор в виде руки для нижней иконки
                '&:hover': {
                  bgcolor: 'transparent', // Убираем изменение фона
                  '& .MuiListItemIcon-root': {
                    color: ICON_COLOR_HOVER, // Изменение цвета иконки при наведении
                  },
                },
              }}
              disableRipple // Убираем эффект "ripple"
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isSidebarOpen ? 1 : 0,
                  color: ICON_COLOR_INACTIVE, // Базовый цвет иконки
                }}
              >
                {isSidebarOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
              </ListItemIcon>
            </ListItem>
          </Box>
        </Box>

        {/* Основная область с фиксированным отступом */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto', // Скролл только внутри основной области
            ml: SIDEBAR_MARGIN, // Фиксированный минимальный отступ слева
            transition: 'margin-left 0.3s', // Плавное смещение при раскрытии
            marginLeft: isSidebarOpen ? `${SIDEBAR_OPEN_WIDTH + SIDEBAR_MARGIN}px` : `${SIDEBAR_CLOSED_WIDTH + SIDEBAR_MARGIN}px`, // Динамическое смещение
            marginTop: `${TITLE_BAR_HEIGHT}px`, // Сдвиг вниз на высоту титульной панели
            maxHeight: `calc(100vh - ${TITLE_BAR_HEIGHT}px)`, // Ограничиваем высоту содержимого
          }}
        >
          {/* Вкладка Посты */}
          {selectedTab === 'posts' && (
            <div>
              <Typography variant="h5" gutterBottom>
                Посты
              </Typography>
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
                <FormControl fullWidth margin="normal">
                  <InputLabel>Выберите свойства</InputLabel>
                  <Select
                    multiple
                    value={selectedProperties}
                    onChange={(e) => setSelectedProperties(e.target.value)}
                    renderValue={(selected) => selected.map(id => {
                      const value = propertyValues.find(v => v.id === id);
                      return value ? `${value.property_name}: ${value.property_value}` : '';
                    }).join(', ')}
                  >
                    {propertyValues.map((value) => (
                      <MenuItem key={value.id} value={value.id}>
                        <Checkbox checked={selectedProperties.indexOf(value.id) > -1} />
                        {`${value.property_name}: ${value.property_value} (${value.value_type})`}
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
                    <TableCell>Свойства</TableCell>
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
                        {post.properties && post.properties.length > 0 ? (
                          post.properties.map((prop) => (
                            <div key={prop.id}>{`${prop.property_name}: ${prop.property_value}`}</div>
                          ))
                        ) : (
                          'Нет свойств'
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
            </div>
          )}

          {/* Вкладка Шаблоны */}
          {selectedTab === 'templates' && (
            <div>
              <Typography variant="h5" gutterBottom>
                Шаблоны
              </Typography>
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
            </div>
          )}

          {/* Вкладка Группы */}
          {selectedTab === 'groups' && (
            <div>
              <Typography variant="h5" gutterBottom>
                Группы
              </Typography>
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
            </div>
          )}

          {/* Вкладка Свойства */}
          {selectedTab === 'properties' && (
            <div>
              <Typography variant="h5" gutterBottom>
                Свойства
              </Typography>
              <Grid container spacing={3}>
                {/* Левая часть: Группы свойств */}
                <Grid item xs={6}>
                  <Typography variant="h6">Группы свойств</Typography>
                  <div style={{ marginBottom: '20px' }}>
                    <TextField
                      label="Название группы свойств"
                      value={newPropertyGroupName}
                      onChange={(e) => setNewPropertyGroupName(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Описание группы свойств"
                      value={newPropertyGroupDescription}
                      onChange={(e) => setNewPropertyGroupDescription(e.target.value)}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                    />
                    <Button variant="contained" onClick={handleAddPropertyGroup} style={{ marginTop: '10px' }}>
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
                      {propertyGroups.map((group) => (
                        <TableRow
                          key={group.id}
                          onClick={() => setSelectedPropertyGroupId(group.id)}
                          selected={selectedPropertyGroupId === group.id}
                          hover
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell>{group.id}</TableCell>
                          <TableCell>{group.group_name}</TableCell>
                          <TableCell>{group.group_description || '-'}</TableCell>
                          <TableCell>{group.created_at}</TableCell>
                          <TableCell>{group.updated_at}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPropertyGroup(group);
                              }}
                              style={{ marginRight: '10px' }}
                            >
                              Редактировать
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePropertyGroup(group.id);
                              }}
                            >
                              Удалить
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>

                {/* Правая часть: Значения свойств */}
                <Grid item xs={6}>
                  {selectedPropertyGroupId && (
                    <Box>
                      <Typography variant="h6">Свойства группы: {propertyGroups.find(g => g.id === selectedPropertyGroupId)?.group_name}</Typography>
                      <div style={{ marginBottom: '20px' }}>
                        <TextField
                          label="Название свойства"
                          value={newPropertyName}
                          onChange={(e) => setNewPropertyName(e.target.value)}
                          fullWidth
                          margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Тип значения</InputLabel>
                          <Select value={newValueType} onChange={(e) => setNewValueType(e.target.value)}>
                            <MenuItem value="text">Текст</MenuItem>
                            <MenuItem value="number">Число</MenuItem>
                            <MenuItem value="date">Дата</MenuItem>
                            <MenuItem value="boolean">Логическое</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          label="Значение свойства"
                          value={newPropertyValue}
                          onChange={(e) => setNewPropertyValue(e.target.value)}
                          fullWidth
                          margin="normal"
                        />
                        <Button variant="contained" onClick={handleAddPropertyValue} style={{ marginTop: '10px' }}>
                          Добавить значение
                        </Button>
                      </div>

                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Тип</TableCell>
                            <TableCell>Значение</TableCell>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>Дата обновления</TableCell>
                            <TableCell>Действия</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {propertyValues.map((value) => (
                            <TableRow key={value.id}>
                              <TableCell>{value.id}</TableCell>
                              <TableCell>{value.property_name}</TableCell>
                              <TableCell>{value.value_type}</TableCell>
                              <TableCell>{value.property_value}</TableCell>
                              <TableCell>{value.created_at}</TableCell>
                              <TableCell>{value.updated_at}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleEditPropertyValue(value)}
                                  style={{ marginRight: '10px' }}
                                >
                                  Редактировать
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleDeletePropertyValue(value.id)}
                                >
                                  Удалить
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </div>
          )}
        </Box>

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
              rows={5}
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Выберите свойства</InputLabel>
              <Select
                multiple
                value={selectedProperties}
                onChange={(e) => setSelectedProperties(e.target.value)}
                renderValue={(selected) => selected.map(id => {
                  const value = propertyValues.find(v => v.id === id);
                  return value ? `${value.property_name}: ${value.property_value}` : '';
                }).join(', ')}
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

        {/* Диалог редактирования группы свойств */}
        <Dialog
          open={!!editPropertyGroup}
          onClose={handlePropertyGroupDialogClose}
          disableRestoreFocus
        >
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

        {/* Диалог редактирования значения свойства */}
        <Dialog
          open={!!editPropertyValue}
          onClose={handlePropertyValueDialogClose}
          disableRestoreFocus
        >
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
      </Box>
      <InfoBar status="Подключено" postCount={posts.length} />
    </ThemeProvider>
  );
}

export default App;
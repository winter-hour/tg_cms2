// src/components/PostsTab.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ResizableBox } from 'react-resizable';
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Box,
} from '@mui/material';
import { FixedSizeList } from 'react-window';
import 'react-resizable/css/styles.css';

const PostsTab = ({
  posts,
  postGroups,
  templates,
  propertyValues,
  newPostTitle,
  setNewPostTitle,
  newPostText,
  setNewPostText,
  newPostGroupId,
  setNewPostGroupId,
  selectedTemplate,
  setSelectedTemplate,
  selectedFiles,
  setSelectedFiles,
  selectedProperties,
  setSelectedProperties,
  handleAddPost,
  handleFileDialog,
  handleEditPost,
  handleDeletePost,
  handleApplyTemplate,
}) => {
  // Начальная ширина из localStorage или 50% по умолчанию
  const [leftWidth, setLeftWidth] = useState(() => {
    const savedWidth = localStorage.getItem('postsTabLeftWidth');
    return savedWidth ? parseInt(savedWidth, 10) : window.innerWidth * 0.5;
  });

  // Сохраняем ширину в localStorage при изменении
  const handleResize = (event, { size }) => {
    setLeftWidth(size.width);
    localStorage.setItem('postsTabLeftWidth', size.width);
  };

  // Компонент для рендеринга строки таблицы
  const Row = React.memo(({ index, style }) => {
    const post = posts[index];
    return (
      <Box
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          borderBottom: '1px solid #ddd',
          backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ width: 50, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.id}
        </Box>
        <Box sx={{ flex: 1, minWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.title || '-'}
        </Box>
        <Box sx={{ flex: 1, minWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.text}
        </Box>
        <Box sx={{ flex: 1, minWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.group_id
            ? postGroups.find((g) => g.id === post.group_id)?.title || 'Неизвестно'
            : '-'}
        </Box>
        <Box sx={{ flex: 1, minWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.is_published ? 'Да' : 'Нет'}
        </Box>
        <Box sx={{ flex: 1, minWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.published_at || '-'}
        </Box>
        <Box sx={{ flex: 1, minWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.created_at}
        </Box>
        <Box sx={{ flex: 1, minWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.attachedFiles && post.attachedFiles.length > 0
            ? post.attachedFiles.map((file) => (
                <div key={file.id}>{file.file_path}</div>
              ))
            : 'Нет'}
        </Box>
        <Box sx={{ flex: 1, minWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.templates && post.attachedFiles.length > 0
            ? post.templates.map((template) => (
                <div key={template.id}>{template.template_name}</div>
              ))
            : 'Нет'}
        </Box>
        <Box sx={{ flex: 1, minWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {post.properties && post.properties.length > 0
            ? post.properties.map((prop) => (
                <div key={prop.id}>{`${prop.property_name}: ${prop.property_value}`}</div>
              ))
            : 'Нет'}
        </Box>
        <Box sx={{ flexShrink: 0, width: 200, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEditPost(post)}
            size="small"
          >
            Редактировать
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeletePost(post.id)}
            size="small"
          >
            Удалить
          </Button>
        </Box>
      </Box>
    );
  });

  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  // Вычисляем ширину таблицы на основе суммы ширин колонок
  const tableWidth = 50 + 120 + 150 + 120 + 120 + 150 + 150 + 120 + 120 + 120 + 200; // 1420px

  return (
    <Box
      ref={containerRef}
      sx={{ display: 'flex', height: 'calc(100vh - 64px - 40px)', overflow: 'hidden' }}
    >
      {/* Левая часть: Список постов */}
      <ResizableBox
        width={leftWidth}
        height={Infinity}
        minConstraints={[window.innerWidth * 0.2, Infinity]} // Мин. 20%
        maxConstraints={[window.innerWidth * 0.8, Infinity]} // Макс. 80%
        axis="x"
        resizeHandles={['e']}
        onResize={handleResize}
        handle={(h, ref) => (
          <Box
            ref={ref}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '5px',
              backgroundColor: '#ddd',
              cursor: 'col-resize',
              '&:hover': { backgroundColor: '#bbb' },
              zIndex: 1000,
              transition: 'background-color 0.2s ease',
              willChange: 'transform',
              height: '100%',
              margin: 0,
              padding: 0,
            }}
          />
        )}
        style={{ margin: 0, padding: 0 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            border: 'none',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ padding: '8px', margin: 0 }}>
            Посты
          </Typography>
          {/* Контейнер для горизонтального скроллинга с заголовками */}
          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              margin: 0,
              padding: 0,
              border: 'none',
            }}
          >
            {/* Заголовки таблицы */}
            <Box
              sx={{
                display: 'flex',
                borderBottom: '2px solid #ddd',
                backgroundColor: '#f5f5f5',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                padding: '8px 0',
                boxSizing: 'border-box',
                minWidth: tableWidth, // Убедимся, что заголовки занимают всю ширину
              }}
            >
              <Box sx={{ width: 50, flexShrink: 0, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                ID
              </Box>
              <Box sx={{ flex: 1, minWidth: 120, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Заголовок
              </Box>
              <Box sx={{ flex: 1, minWidth: 150, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Текст
              </Box>
              <Box sx={{ flex: 1, minWidth: 120, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Группа
              </Box>
              <Box sx={{ flex: 1, minWidth: 120, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Опубликовано
              </Box>
              <Box sx={{ flex: 1, minWidth: 150, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Дата публикации
              </Box>
              <Box sx={{ flex: 1, minWidth: 150, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Дата создания
              </Box>
              <Box sx={{ flex: 1, minWidth: 120, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Файлы
              </Box>
              <Box sx={{ flex: 1, minWidth: 120, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Шаблоны
              </Box>
              <Box sx={{ flex: 1, minWidth: 120, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Свойства
              </Box>
              <Box sx={{ flexShrink: 0, width: 200, padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Действия
              </Box>
            </Box>
            {/* Таблица с данными */}
            <FixedSizeList
              height={
                containerRef.current
                  ? containerRef.current.offsetHeight - 48 - 40
                  : window.innerHeight - 64 - 40 - 48
              }
              width={tableWidth}
              itemCount={posts.length}
              itemSize={60}
              style={{ overflowX: 'hidden', overflowY: 'hidden' }}
            >
              {Row}
            </FixedSizeList>
          </Box>
        </Box>
      </ResizableBox>

      {/* Правая часть: Добавление поста */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pl: 2 }}>
        <Typography variant="h5" gutterBottom>
          Новый пост
        </Typography>
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
          <Select value={newPostGroupId} onChange={(e) => setNewPostGroupId(e.target.value)}>
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
              const template = templates.find((t) => t.id === e.target.value);
              if (template) handleApplyTemplate(template.template_text);
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
        <Button variant="contained" onClick={handleFileDialog} sx={{ my: 1 }}>
          Выбрать файлы
        </Button>
        <Box>
          {selectedFiles.map((file, index) => (
            <div key={index}>{file.name}</div>
          ))}
        </Box>
        <Button variant="contained" onClick={handleAddPost} sx={{ mt: 2 }}>
          Добавить пост
        </Button>
      </Box>
    </Box>
  );
};

export default PostsTab;
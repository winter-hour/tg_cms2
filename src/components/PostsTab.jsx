// src/components/PostsTab.jsx
import React from 'react';
import {
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';

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
  return (
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
                {post.group_id
                  ? postGroups.find((g) => g.id === post.group_id)?.title || 'Неизвестно'
                  : '-'}
              </TableCell>
              <TableCell>{post.is_published ? 'Да' : 'Нет'}</TableCell>
              <TableCell>{post.published_at || '-'}</TableCell>
              <TableCell>{post.created_at}</TableCell>
              <TableCell>
                {post.attachedFiles && post.attachedFiles.length > 0 ? (
                  post.attachedFiles.map((file) => <div key={file.id}>{file.file_path}</div>)
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
                >
                  Редактировать
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDeletePost(post.id)}>
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PostsTab;
import { useState, useEffect } from 'react';
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
} from '@mui/material';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [editPost, setEditPost] = useState(null);
  const [editText, setEditText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await window.electronAPI.getPosts();
      const postsWithFiles = await Promise.all(
        postsData.map(async (post) => {
          const files = await window.electronAPI.getAttachedFiles(post.id);
          return { ...post, attachedFiles: files };
        })
      );
      setPosts(postsWithFiles);
    } catch (err) {
      console.error('Ошибка загрузки постов:', err);
    }
  };

  const handleAddPost = async () => {
    if (!newPostText) return;

    const post = {
      text: newPostText,
      media: null,
      status: 'draft',
      scheduledAt: null,
    };

    try {
      const postId = await window.electronAPI.addPost(post);
      for (const file of selectedFiles) {
        console.log('Processing file:', file); // Отладка
        if (!file.path) {
          console.error('File path is undefined:', file);
          continue;
        }
        const fileType = file.path.split('.').pop().toLowerCase(); // Простая проверка типа файла по расширению
        await window.electronAPI.addAttachedFile(postId, file.path, file.name, fileType); // Передаём параметры отдельно
      }
      await fetchPosts();
      setNewPostText('');
      setSelectedFiles([]);
    } catch (err) {
      console.error('Ошибка добавления поста или файлов:', err);
    }
  };

  const handleFileDialog = async () => {
    const files = await window.electronAPI.openFileDialog();
    console.log('Selected files:', files); // Отладка
    setSelectedFiles(files);
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setEditText(post.text);
  };

  const handleSaveEdit = async () => {
    if (!editText || !editPost) return;

    const updatedPost = {
      text: editText,
      media: editPost.media,
      status: editPost.status,
      scheduledAt: editPost.scheduled_at,
    };

    try {
      await window.electronAPI.updatePost(editPost.id, updatedPost);
      await fetchPosts();
      setEditPost(null);
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Telegram CMS
      </Typography>

      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Текст поста"
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          fullWidth
          margin="normal"
        />
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
            <TableCell>Текст</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Запланировано</TableCell>
            <TableCell>Прикреплённые файлы</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell>{post.text}</TableCell>
              <TableCell>{post.status}</TableCell>
              <TableCell>{post.scheduled_at || '-'}</TableCell>
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
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditPost(post)}
                  style={{ marginRight: '10px' }}
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

      <Dialog open={!!editPost} onClose={() => setEditPost(null)}>
        <DialogTitle>Редактировать пост</DialogTitle>
        <DialogContent>
          <TextField
            label="Текст поста"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPost(null)}>Отмена</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await window.electronAPI.getPosts();
      setPosts(postsData || []); // Добавляем || [] на случай, если данных нет
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
      await window.electronAPI.addPost(post);
      await fetchPosts();
      setNewPostText('');
    } catch (err) {
      console.error('Ошибка добавления поста:', err);
    }
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
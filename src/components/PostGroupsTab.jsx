// src/components/GroupsTab.jsx
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
} from '@mui/material';

const GroupsTab = ({
  postGroups,
  newGroupTitle,
  setNewGroupTitle,
  newGroupDescription,
  setNewGroupDescription,
  handleAddPostGroup,
  handleEditPostGroup,
  handleDeletePostGroup,
}) => {
  return (
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
  );
};

export default GroupsTab;
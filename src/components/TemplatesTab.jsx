// src/components/TemplatesTab.jsx
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

const TemplatesTab = ({
  templates,
  newTemplateName,
  setNewTemplateName,
  newTemplateText,
  setNewTemplateText,
  newTemplateDescription,
  setNewTemplateDescription,
  handleAddTemplate,
  handleEditTemplate,
  handleDeleteTemplate,
}) => {
  return (
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
  );
};

export default TemplatesTab;
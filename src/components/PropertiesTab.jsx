// src/components/PropertiesTab.jsx
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
  Grid,
} from '@mui/material';

const PropertiesTab = ({
  propertyGroups,
  propertyValues,
  selectedPropertyGroupId,
  setSelectedPropertyGroupId,
  newPropertyGroupName,
  setNewPropertyGroupName,
  newPropertyGroupDescription,
  setNewPropertyGroupDescription,
  newPropertyName,
  setNewPropertyName,
  newValueType,
  setNewValueType,
  newPropertyValue,
  setNewPropertyValue,
  handleAddPropertyGroup,
  handleEditPropertyGroup,
  handleDeletePropertyGroup,
  handleAddPropertyValue,
  handleEditPropertyValue,
  handleDeletePropertyValue,
}) => {
  return (
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
            <>
              <Typography variant="h6">
                Свойства группы:{' '}
                {propertyGroups.find((g) => g.id === selectedPropertyGroupId)?.group_name}
              </Typography>
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
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default PropertiesTab;
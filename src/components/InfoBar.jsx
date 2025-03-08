// src/components/InfoBar.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const InfoBar = ({ status, postCount }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 25, // Высота бара
        backgroundColor: '#f5f5f5', // Цвет фона (как paper из темы)
        borderTop: '1px solid #e0e0e0', // Граница сверху
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Распределяем содержимое
        padding: '0 16px', // Отступы слева и справа
        zIndex: 1000, // Чтобы бар был поверх остального контента
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Tg CMS 2.0 | Версия: 1.0.0
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Постов: {postCount} | Статус: {status}
      </Typography>
    </Box>
  );
};

export default InfoBar;
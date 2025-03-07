import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const TitleBar = () => {
  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI.maximizeWindow();
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  return (
    <Box
      sx={{
        height: 32, // Высота панели
        backgroundColor: '#222222', // Цвет фона (можно настроить под тему)
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        userSelect: 'none', // Отключаем выделение текста
        '-webkit-app-region': 'drag', // Делаем панель перетаскиваемой
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100, // Выше боковой панели (zIndex: 1000)
      }}
    >
      {/* Название приложения */}
      <Typography variant="h6" sx={{ fontSize: '14px', paddingLeft: '10px' }}>
        Telegram CMS
      </Typography>

      {/* Кнопки управления */}
      <Box>
        <IconButton
          size="small"
          onClick={handleMinimize}
          sx={{
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            '-webkit-app-region': 'no-drag', // Отключаем перетаскивание для кнопок
          }}
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleMaximize}
          sx={{
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            '-webkit-app-region': 'no-drag',
          }}
        >
          <MaximizeIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.6)' }, // Красный при наведении для закрытия
            '-webkit-app-region': 'no-drag',
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TitleBar;
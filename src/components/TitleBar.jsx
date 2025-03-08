// src/components/TitleBar.jsx
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
        height: 32,
        backgroundColor: '#222222',
        color: '#b3b3b3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        userSelect: 'none',
        '-webkit-app-region': 'drag',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
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
            color: '#b3b3b3',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 0, // Прямоугольный фон при наведении
            },
            '-webkit-app-region': 'no-drag',
            borderRadius: 0, // Убираем скругление по умолчанию
          }}
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleMaximize}
          sx={{
            color: '#b3b3b3',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 0, // Прямоугольный фон при наведении
            },
            '-webkit-app-region': 'no-drag',
            borderRadius: 0, // Убираем скругление по умолчанию
          }}
        >
          <MaximizeIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: '#b3b3b3',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.6)', // Красный для закрытия
              borderRadius: 0, // Прямоугольный фон при наведении
            },
            '-webkit-app-region': 'no-drag',
            borderRadius: 0, // Убираем скругление по умолчанию
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TitleBar;
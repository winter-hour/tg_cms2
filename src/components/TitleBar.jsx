// src/components/TitleBar.jsx
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  Minimize as MinimizeIcon,
  CropSquare as MaximizeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const LogoTgCms = (props) => (
  <svg
    width="300"
    height="300"
    viewBox="0 0 300 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M233 263L233 38"
      stroke="currentColor"
      strokeWidth="50"
      strokeLinecap="round"
    />
    <path
      d="M107 38L227 38"
      stroke="currentColor"
      strokeWidth="50"
      strokeLinecap="round"
    />
    <path
      d="M68.9941 169.896L228.09 261.75"
      stroke="currentColor"
      strokeWidth="50"
      strokeLinecap="round"
    />
    <path
      d="M66.5293 168.044L139.376 125.986"
      stroke="currentColor"
      strokeWidth="50"
      strokeLinecap="round"
    />
  </svg>
);

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
        WebkitAppRegion: 'drag',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component={LogoTgCms}
          sx={{
            width: 18,
            height: 18,
            mr: 0.4,
            // color: '#b3b3b3',
            color: '#1967d2',
          }}
        />
        <Typography variant="h6" sx={{ fontSize: '14px' }}>
          Telegram CMS
        </Typography>
      </Box>

      <Box>
        <IconButton
          size="small"
          onClick={handleMinimize}
          sx={{
            color: '#b3b3b3',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 0 },
            WebkitAppRegion: 'no-drag',
            borderRadius: 0,
            '& .MuiSvgIcon-root': { fontSize: 16 }, 
          }}
        >
          <MinimizeIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleMaximize}
          sx={{
            color: '#b3b3b3',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 0 },
            WebkitAppRegion: 'no-drag',
            borderRadius: 0,
            '& .MuiSvgIcon-root': { fontSize: 16 },
          }}
        >
          <MaximizeIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: '#b3b3b3',
            '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.6)', borderRadius: 0 },
            WebkitAppRegion: 'no-drag',
            borderRadius: 0,
            '& .MuiSvgIcon-root': { fontSize: 16 },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TitleBar;
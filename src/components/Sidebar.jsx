// src/components/Sidebar.jsx
//TODO Вынести сайдбар в отдельный компонент
import React from 'react';
import { Box } from '@mui/material';

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <Box
    component="nav"
    sx={{
      width: isOpen ? 240 : 56,
      flexShrink: 0,
      transition: 'width 0.3s',
      overflowX: 'hidden',
      bgcolor: 'background.paper',
      borderRight: '1px solid',
      borderColor: 'divider',
    }}
  >
    {/* Содержимое боковой панели */}
  </Box>
);
export default Sidebar;

// В App.jsx
import Sidebar from './components/Sidebar';
// ...
<Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
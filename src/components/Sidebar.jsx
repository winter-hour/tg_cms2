// src/components/Sidebar.jsx
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip, // Добавляем Tooltip для подсказок
} from '@mui/material';
import {
  Article as PostIcon,
  Group as GroupIcon,
  Description as TemplateIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// Константы для боковой панели
const SIDEBAR_WIDTH = 40; // Фиксированная ширина (было SIDEBAR_CLOSED_WIDTH)
const TITLE_BAR_HEIGHT = 32;
const ICON_COLOR_HOVER = '#293346';
const ICON_COLOR_ACTIVE = '#293346';
const ICON_COLOR_INACTIVE = '#757575';

// Список вкладок
const tabs = [
  { id: 'posts', label: 'Посты', icon: <PostIcon /> },
  { id: 'groups', label: 'Группы', icon: <GroupIcon /> },
  { id: 'templates', label: 'Шаблоны', icon: <TemplateIcon /> },
  { id: 'properties', label: 'Свойства', icon: <SettingsIcon /> },
];

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH, // Фиксированная ширина
        bgcolor: '#f5f5f5',
        borderRight: '1px solid #ddd',
        height: `calc(100vh - ${TITLE_BAR_HEIGHT}px)`,
        overflow: 'auto',
        ml: 0,
        p: 0,
        mt: `${TITLE_BAR_HEIGHT}px`,
        position: 'fixed',
        zIndex: 1000,
      }}
    >
      {/* Меню */}
      <List>
        {tabs.map((tab) => (
          <ListItem key={tab.id} disablePadding>
            <Tooltip title={tab.label} placement="right" arrow>
              <ListItemButton
                onClick={() => setSelectedTab(tab.id)}
                sx={{
                  p: 1,
                  minHeight: 48,
                  justifyContent: 'center', // Всегда центрируем, так как текст убран
                  '&:hover': {
                    bgcolor: 'transparent',
                    '& .MuiListItemIcon-root': {
                      color: ICON_COLOR_HOVER,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    color: selectedTab === tab.id ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE,
                  }}
                >
                  {tab.icon}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
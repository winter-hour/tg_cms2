// src/components/Sidebar.jsx
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton, // Добавляем ListItemButton для кнопок
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Article as PostIcon,
  Group as GroupIcon,
  Description as TemplateIcon,
  Settings as SettingsIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';

// Константы для боковой панели
const SIDEBAR_OPEN_WIDTH = 125;
const SIDEBAR_CLOSED_WIDTH = 56;
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

const Sidebar = ({ isOpen, toggleSidebar, selectedTab, setSelectedTab }) => {
  return (
    <Box
      sx={{
        width: isOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH,
        bgcolor: '#f5f5f5',
        borderRight: '1px solid #ddd',
        height: `calc(100vh - ${TITLE_BAR_HEIGHT}px)`,
        overflow: 'auto',
        transition: 'width 0.3s',
        ml: 0,
        p: 0,
        mt: `${TITLE_BAR_HEIGHT}px`,
        position: 'fixed',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Меню */}
      <List>
        {tabs.map((tab) => (
          <ListItem key={tab.id} disablePadding>
            <ListItemButton
              onClick={() => setSelectedTab(tab.id)}
              sx={{
                p: 1,
                minHeight: 48,
                justifyContent: isOpen ? 'initial' : 'center',
                '&:hover': {
                  bgcolor: 'transparent',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: ICON_COLOR_HOVER,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 1 : 0,
                  color: selectedTab === tab.id ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE,
                }}
              >
                {tab.icon}
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary={tab.label}
                  sx={{
                    color: selectedTab === tab.id ? ICON_COLOR_ACTIVE : ICON_COLOR_INACTIVE,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Кнопка для раскрытия/сворачивания внизу */}
      <Box sx={{ p: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={toggleSidebar}
            sx={{
              p: 1,
              minHeight: 65,
              justifyContent: isOpen ? 'initial' : 'center',
              '&:hover': {
                bgcolor: 'transparent',
                '& .MuiListItemIcon-root': {
                  color: ICON_COLOR_HOVER,
                },
              },
            }}
            disableRipple // Теперь работает корректно
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isOpen ? 1 : 0,
                color: ICON_COLOR_INACTIVE,
              }}
            >
              {isOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;
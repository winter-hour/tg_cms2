// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Оставим синий как акцент для ключевых действий
    },
    secondary: {
      main: '#757575', // Серый для менее важных элементов
    },
    background: {
      default: '#ffffff', // Белый фон
      paper: '#f5f5f5', // Лёгкий серый для панелей
    },
    text: {
      primary: '#212121', // Тёмный текст
      secondary: '#757575', // Светло-серый для второстепенного
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Чёткий шрифт
    fontSize: 14, // Базовый размер уменьшаем
    button: {
      textTransform: 'none', // Убираем заглавные буквы в кнопках
      fontWeight: 500,
    },
  },
  components: {
    // Уменьшаем отступы и размеры глобально
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '4px 8px', // Компактные кнопки
          borderRadius: 2, // Минимальные скругления
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            height: 36, // Уменьшаем высоту полей
            fontSize: '0.875rem', // 14px
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '6px 12px', // Уменьшаем отступы в ячейках таблицы
          fontSize: '0.875rem', // 14px
        },
      },
    },
  },
});

export default theme;
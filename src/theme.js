// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1967d2',
    },
    secondary: {
      main: '#757575',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '4px 8px',
          borderRadius: 4,
        },
      },
    },


    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            height: 36, // Для однострочных
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem',
            '&.MuiInputBase-multiline': {
              height: 'auto',
              minHeight: '120px',
              padding: '8px',
              alignItems: 'flex-start', // Курсор сверху
              justifyContent: 'flex-start', // Предотвращаем смещение вправо
            },
          },
          '& .MuiInputBase-input': {
            textAlign: 'left',
            '&.MuiInputBase-inputMultiline': {
              padding: 0, // Курсор вверху слева
              textAlign: 'left',
              verticalAlign: 'top', // Курсор сверху
              lineHeight: '1.5',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            backgroundColor: 'white',
            transition: 'all 0.2s ease-out',
            // По умолчанию для однострочных
            top: '50%',
            transform: 'translate(14px, -50%)',
            // Для многострочных в неактивном состоянии
            '&[data-shrink="false"]': {
              top: 8, // Label вверху
              transform: 'translate(14px, 0)', // Слева без центрирования
              '& + .MuiInputBase-root.MuiInputBase-multiline': {
                // Убеждаемся, что поле не смещается
                marginLeft: 0,
              },
            },
            // При фокусе или заполнении
            '&.MuiInputLabel-shrink': {
              top: 0,
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
        },
      },
    },
    
    
    

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '6px 12px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        select: {
          height: 36,
          lineHeight: '36px',
          padding: '8px 24px 8px 8px',
          fontSize: '0.875rem',
          boxSizing: 'border-box',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
        },
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
            borderWidth: 1,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#757575',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
            borderWidth: 2,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
            borderWidth: 1,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#757575',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
            borderWidth: 2,
          },
        },
        notchedOutline: {
          padding: '0 8px',
          '& legend': {
            fontSize: '0.01px',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          maxHeight: 200,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '4px 12px',
          fontSize: '0.875rem',
          minHeight: 32,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 4,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          top: '50%',
          transform: 'translate(14px, -50%)',
          fontSize: '0.875rem',
          padding: '0 4px',
          textAlign: 'left',
          backgroundColor: 'white',
          '&.Mui-focused, &.MuiFormLabel-filled': {
            top: 0,
            transform: 'translate(14px, -9px) scale(0.75)',
          },
        },
      },
    },
  },
});

export default theme;
// src/theme/mvTheme.ts
import { defaultTheme } from 'react-admin';
import { deepmerge } from '@mui/utils';

export const mvTheme = deepmerge(defaultTheme, {
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e40af',
    },
    background: {
      default: '#020817',
      paper: '#0a0f1a',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
    divider: 'rgba(37,99,235,0.15)',
  },
  typography: {
    fontFamily: "'Barlow', sans-serif",
    h6: {
      fontWeight: 900,
      letterSpacing: '-0.01em',
    },
    body1: { fontWeight: 500 },
    body2: { fontWeight: 500 },
    button: {
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      letterSpacing: '0.08em',
      fontSize: '0.72rem',
    },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Barlow:wght@400;500;600;700;900&display=swap');
        
        body {
          background-color: #020817 !important;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0f1a;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `,
    },

    // ── SIDEBAR / DRAWER ──────────────────────────────────────
    RaLayout: {
      styleOverrides: {
        root: {
          '& .RaLayout-appFrame': {
            marginTop: 0,
          },
        },
      },
    },
    RaSidebar: {
      styleOverrides: {
        root: {
          '& .MuiDrawer-paper': {
            background: '#040c1a',
            borderRight: '1px solid rgba(37,99,235,0.15)',
            width: 240,
          },
        },
      },
    },
    RaMenu: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
          '& .RaMenuItemLink-root': {
            borderRadius: 12,
            margin: '2px 8px',
            padding: '10px 16px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#64748b',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(37,99,235,0.1)',
              color: '#93c5fd',
            },
            '&.RaMenuItemLink-active': {
              backgroundColor: 'rgba(37,99,235,0.15)',
              color: '#3b82f6',
              borderLeft: '3px solid #2563eb',
              '& .MuiListItemIcon-root': {
                color: '#3b82f6',
              },
            },
          },
          '& .MuiListItemIcon-root': {
            color: '#475569',
            minWidth: 36,
          },
        },
      },
    },

    // ── TOP BAR ───────────────────────────────────────────────
    RaAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(4, 12, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(37,99,235,0.15)',
          boxShadow: 'none',
          '& .RaAppBar-title': {
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 900,
            fontSize: '1.15rem',
            letterSpacing: '-0.01em',
            color: '#ffffff',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(4, 12, 26, 0.95) !important',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(37,99,235,0.15)',
          boxShadow: 'none !important',
        },
      },
    },

    // ── CARDS / PAPERS ────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#0a0f1a',
          border: '1px solid rgba(37,99,235,0.12)',
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#0a0f1a',
          border: '1px solid rgba(37,99,235,0.12)',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },

    // ── BUTTONS ───────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          letterSpacing: '0.08em',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          boxShadow: '0 0 20px rgba(37,99,235,0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            boxShadow: '0 0 30px rgba(37,99,235,0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(37,99,235,0.4)',
          color: '#3b82f6',
          '&:hover': {
            borderColor: '#2563eb',
            background: 'rgba(37,99,235,0.08)',
          },
        },
      },
    },

    // ── INPUTS ────────────────────────────────────────────────
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: 'rgba(10,15,26,0.8)',
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(37,99,235,0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(37,99,235,0.4)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563eb',
            boxShadow: '0 0 0 3px rgba(37,99,235,0.1)',
          },
        },
        input: {
          color: '#e2e8f0',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 600,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#64748b',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 600,
          fontSize: '0.85rem',
          '&.Mui-focused': { color: '#3b82f6' },
        },
      },
    },

    // ── TABLE / DATAGRID ──────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            background: '#040c1a',
            color: '#3b82f6',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(37,99,235,0.2)',
            padding: '14px 16px',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background 0.15s ease',
            '&:hover': {
              background: 'rgba(37,99,235,0.06) !important',
            },
          },
          '& .MuiTableCell-body': {
            borderBottom: '1px solid rgba(37,99,235,0.08)',
            color: '#cbd5e1',
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            padding: '12px 16px',
          },
        },
      },
    },

    // ── CHIPS ─────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
        },
      },
    },

    // ── TOOLTIPS ──────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#0f172a',
          border: '1px solid rgba(37,99,235,0.2)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          borderRadius: 8,
        },
      },
    },

    // ── SNACKBAR / NOTIFICATION ───────────────────────────────
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          background: '#0f172a',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 12,
          fontFamily: "'Barlow', sans-serif",
        },
      },
    },

    // ── SELECT ────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        icon: { color: '#475569' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#0d1526',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 12,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 600,
          fontSize: '0.85rem',
          color: '#cbd5e1',
          '&:hover': { background: 'rgba(37,99,235,0.1)' },
          '&.Mui-selected': {
            background: 'rgba(37,99,235,0.15)',
            color: '#3b82f6',
          },
        },
      },
    },

    // ── PAGINATION ────────────────────────────────────────────
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: '#64748b',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.7rem',
          borderTop: '1px solid rgba(37,99,235,0.1)',
        },
        selectIcon: { color: '#475569' },
      },
    },

    // ── BREADCRUMB / TOOLBAR ──────────────────────────────────
    RaTopToolbar: {
      styleOverrides: {
        root: {
          paddingTop: 12,
          paddingBottom: 8,
          background: 'transparent',
        },
      },
    },
    RaFilterForm: {
      styleOverrides: {
        root: {
          alignItems: 'center',
        },
      },
    },
  },
});
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
    error:   { main: '#ef4444' },
    success: { main: '#22c55e' },
    divider: 'rgba(37,99,235,0.15)',
  },

  typography: {
    fontFamily: "'Barlow', sans-serif",
    h6: { fontWeight: 900, letterSpacing: '-0.01em' },
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

        ::selection {
          background: rgba(37,99,235,0.35);
          color: #e2e8f0;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1a; }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover { background: #2563eb; }

        /* Row entrance animation */
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .MuiTableBody-root .MuiTableRow-root {
          animation: rowIn 0.2s ease forwards;
        }

        /* Stagger rows */
        .MuiTableBody-root .MuiTableRow-root:nth-child(1)  { animation-delay: 0.03s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(2)  { animation-delay: 0.06s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(3)  { animation-delay: 0.09s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(4)  { animation-delay: 0.12s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(5)  { animation-delay: 0.15s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(6)  { animation-delay: 0.18s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(7)  { animation-delay: 0.21s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(8)  { animation-delay: 0.24s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(9)  { animation-delay: 0.27s; }
        .MuiTableBody-root .MuiTableRow-root:nth-child(10) { animation-delay: 0.30s; }

        /* Page fade-in */
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .RaList-root, .RaEdit-root, .RaCreate-root {
          animation: pageIn 0.3s ease forwards;
        }

        /* Sidebar item entrance */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .RaMenuItemLink-root {
          animation: slideInLeft 0.25s ease forwards;
        }
      `,
    },

    // ── LAYOUT ────────────────────────────────────────────────
    RaLayout: {
      styleOverrides: {
        root: {
          '& .RaLayout-appFrame': { marginTop: 0 },
        },
      },
    },

    // ── SIDEBAR ───────────────────────────────────────────────
    RaSidebar: {
      styleOverrides: {
        root: {
          '& .MuiDrawer-paper': {
            background: '#040c1a',
            borderRight: '1px solid rgba(37,99,235,0.15)',
            width: 240,
            display: 'flex',
            flexDirection: 'column',
          },
        },
      },
    },

    RaMenu: {
      styleOverrides: {
        root: {
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,

          // Item do menu — altura fixa garante alinhamento consistente
          '& .RaMenuItemLink-root': {
            borderRadius: 10,
            padding: '0 12px',
            height: 44,
            display: 'flex',
            alignItems: 'center',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#64748b',
            transition: 'all 0.2s ease',
            // border-left sempre presente para não deslocar o layout
            borderLeft: '3px solid transparent',

            '&:hover': {
              backgroundColor: 'rgba(37,99,235,0.1)',
              color: '#93c5fd',
              borderLeft: '3px solid rgba(37,99,235,0.35)',
              '& .MuiListItemIcon-root': { color: '#93c5fd' },
            },

            '&.RaMenuItemLink-active': {
              backgroundColor: 'rgba(37,99,235,0.15)',
              color: '#3b82f6',
              borderLeft: '3px solid #2563eb',
              boxShadow: 'inset 0 0 24px rgba(37,99,235,0.06)',
              '& .MuiListItemIcon-root': { color: '#3b82f6' },
              '& .MuiListItemText-root span': { color: '#3b82f6' },
            },
          },

          // Ícone: tamanho fixo, centrado, sem minWidth a empurrar o texto
          '& .MuiListItemIcon-root': {
            color: '#475569',
            minWidth: 'unset',
            width: 36,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'color 0.2s',
            margin: 0,
            '& .MuiSvgIcon-root': { fontSize: '1.1rem' },
          },

          // Texto: herda a cor do item, sem margin extra
          '& .MuiListItemText-root': {
            margin: 0,
            flex: 1,
            '& .MuiListItemText-primary': {
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              lineHeight: 1,
              color: 'inherit',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          },
        },
      },
    },

    // Remove padding padrão do MuiListItem que quebra o alinhamento
    MuiListItem: {
      styleOverrides: {
        root: { padding: 0 },
      },
    },

    // ── APPBAR ────────────────────────────────────────────────
    RaAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(4,12,26,0.95)',
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
          background: 'rgba(4,12,26,0.95) !important',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(37,99,235,0.15)',
          boxShadow: 'none !important',
        },
      },
    },

    // ── PAPER / CARD ──────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#0a0f1a',
          border: '1px solid rgba(37,99,235,0.12)',
          borderRadius: 16,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': {
            borderColor: 'rgba(37,99,235,0.2)',
          },
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
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': {
            borderColor: 'rgba(37,99,235,0.22)',
            boxShadow: '0 4px 32px rgba(37,99,235,0.08)',
          },
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
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
            opacity: 0,
            transition: 'opacity 0.2s',
          },
          '&:hover::after': { opacity: 1 },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          boxShadow: '0 0 20px rgba(37,99,235,0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            boxShadow: '0 0 30px rgba(37,99,235,0.4)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
        outlinedPrimary: {
          borderColor: 'rgba(37,99,235,0.4)',
          color: '#3b82f6',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#2563eb',
            background: 'rgba(37,99,235,0.08)',
            boxShadow: '0 0 16px rgba(37,99,235,0.15)',
            transform: 'translateY(-1px)',
          },
        },
        textPrimary: {
          color: '#64748b',
          '&:hover': {
            color: '#3b82f6',
            background: 'rgba(37,99,235,0.06)',
          },
        },
        containedError: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          '&:hover': {
            background: 'linear-gradient(135deg, #f87171, #ef4444)',
            boxShadow: '0 0 24px rgba(239,68,68,0.3)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            color: '#3b82f6',
            background: 'rgba(37,99,235,0.08)',
            transform: 'scale(1.1)',
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
          transition: 'box-shadow 0.2s',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(37,99,235,0.2)',
            transition: 'border-color 0.2s',
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
          transition: 'color 0.2s',
          '&.Mui-focused': { color: '#3b82f6' },
        },
      },
    },

    // ── TABLE ─────────────────────────────────────────────────
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
            '&:nth-of-type(even)': {
              background: 'rgba(37,99,235,0.015)',
            },
            '&:hover': {
              background: 'rgba(37,99,235,0.06) !important',
              '& .MuiTableCell-body': { color: '#e2e8f0' },
            },
          },
          '& .MuiTableCell-body': {
            borderBottom: '1px solid rgba(37,99,235,0.08)',
            color: '#cbd5e1',
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            padding: '12px 16px',
            transition: 'color 0.15s',
          },
        },
      },
    },

    // ── CHIP ──────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'scale(1.04)' },
        },
      },
    },

    // ── TOOLTIP ───────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#0f172a',
          border: '1px solid rgba(37,99,235,0.2)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.65rem',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        },
        arrow: { color: '#0f172a' },
      },
    },

    // ── SNACKBAR ──────────────────────────────────────────────
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          background: '#0f172a',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 12,
          fontFamily: "'Barlow', sans-serif",
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        },
      },
    },

    // ── SELECT / MENU ─────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        icon: { color: '#475569', transition: 'color 0.2s' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#0d1526',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 12,
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
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
          transition: 'all 0.15s ease',
          '&:hover': {
            background: 'rgba(37,99,235,0.1)',
            color: '#93c5fd',
            paddingLeft: 20,
          },
          '&.Mui-selected': {
            background: 'rgba(37,99,235,0.15)',
            color: '#3b82f6',
            '&:hover': { background: 'rgba(37,99,235,0.2)' },
          },
        },
      },
    },

    // ── DIALOG ────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#0a0f1a',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 16,
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
        },
      },
    },

    // ── SWITCH / CHECKBOX ─────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          transition: 'all 0.2s ease',
          '&.Mui-checked': {
            color: '#3b82f6',
            '& + .MuiSwitch-track': {
              background: 'rgba(37,99,235,0.4)',
              opacity: 1,
            },
          },
        },
        track: {
          background: 'rgba(71,85,105,0.4)',
          opacity: 1,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#475569',
          transition: 'color 0.2s',
          '&.Mui-checked': { color: '#2563eb' },
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
        actions: {
          '& .MuiIconButton-root': {
            color: '#475569',
            '&:not(.Mui-disabled):hover': {
              color: '#3b82f6',
              background: 'rgba(37,99,235,0.08)',
            },
          },
        },
      },
    },

    // ── TOOLBAR ───────────────────────────────────────────────
    RaTopToolbar: {
      styleOverrides: {
        root: {
          paddingTop: 12,
          paddingBottom: 8,
          background: 'transparent',
          gap: 8,
        },
      },
    },

    RaFilterForm: {
      styleOverrides: {
        root: { alignItems: 'center' },
      },
    },

    // ── DIVIDER ───────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(37,99,235,0.1)' },
      },
    },
  },
});
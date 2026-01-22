import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { 
  Box, 
  Card, 
  Button, 
  TextField, 
  Typography, 
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // O authProvider espera { username, password }
    login({ username: email, password })
      .catch(() => {
        setLoading(false);
        notify('Erro: E-mail ou palavra-passe incorretos', { type: 'warning' });
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // Fundo escuro luxuoso
        padding: 2,
      }}
    >
      <Card sx={{ minWidth: 350, maxWidth: 450, padding: 4, borderRadius: 3, boxShadow: 10 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              backgroundColor: '#ea2a33',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 2
            }}
          >
            <LockOutlined sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="#1e293b">
            MilVendas Admin
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Aceda ao painel de gestão tecnológica
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="E-mail"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <TextField
            fullWidth
            label="Palavra-passe"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              marginTop: 3,
              padding: 1.5,
              backgroundColor: '#ea2a33',
              '&:hover': { backgroundColor: '#c21d25' },
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar no Sistema'}
          </Button>
        </form>
      </Card>
      <Typography variant="caption" sx={{ marginTop: 3, color: 'rgba(255,255,255,0.5)' }}>
        &copy; {new Date().getFullYear()} MilVendas Tech. Todos os direitos reservados.
      </Typography>
      <Notification />
    </Box>
  );
};

export default LoginPage;
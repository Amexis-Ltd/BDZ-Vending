import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cashierLoginSuccess, selectIsCashierLoggedIn } from '../store/features/auth/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCashierLoggedIn = useAppSelector(selectIsCashierLoggedIn);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/cashier/dashboard';

  useEffect(() => {
    if (isCashierLoggedIn) {
      navigate('/cashier/dashboard');
    }
  }, [isCashierLoggedIn, navigate]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setErrorMessage(null);
    
    if (username.trim() && password.trim()) {
      // For the POC, we'll accept any non-empty values
      // In a real app, we would validate against a backend service
      dispatch(cashierLoginSuccess(username));
      // Navigate to the page they tried to visit or dashboard
      navigate(from, { replace: true });
    } else {
      setErrorMessage('Моля, въведете потребителско име и парола');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <img
            src="https://s.bdz.bg/2020/images/logo.svg"
            alt="БДЖ Лого"
            style={{ maxWidth: '200px', height: 'auto', marginBottom: '1rem' }}
          />
          <Typography component="h1" variant="h5" gutterBottom>
            Вход в системата
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Модул Стационарна каса
          </Typography>
        </Box>
        
        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Потребителско име"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Парола"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Вход
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ mt: 1 }}
          >
            Назад към началната страница
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage; 
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import LinkMui from '@mui/material/Link';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { customerLoginSuccess, selectIsCustomerLoggedIn } from '../store/features/auth/authSlice';

const CustomerLoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCustomerLoggedIn = useAppSelector(selectIsCustomerLoggedIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/profile';

  useEffect(() => {
    if (isCustomerLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isCustomerLoggedIn, navigate, from]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    
    if (email.trim() && password.trim()) {
      dispatch(customerLoginSuccess(email));
      navigate('/profile', { replace: true });
    } else {
      setErrorMessage('Моля, въведете имейл и парола');
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
            Вход за клиенти
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Влезте във Вашия БДЖ профил
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
            id="email"
            label="Имейл адрес"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
            <LinkMui component={Link} to="/" variant="body2"> 
              Назад към началната страница
            </LinkMui>
            <LinkMui component={Link} to="/cashier-login" variant="body2">
              Вход за касиери
            </LinkMui>
          </Box>
           {/* Placeholder for registration/password recovery */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <LinkMui href="#" variant="body2">
              Нямате акаунт? Регистрирайте се
            </LinkMui>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CustomerLoginPage; 
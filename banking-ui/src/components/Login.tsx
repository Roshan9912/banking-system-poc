import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert
} from '@mui/material';
import type { User } from '../types';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    let user: User | null = null;

    if (username === 'cust1' && password === 'pass') {
      user = { username, role: 'CUSTOMER' };
    } else if (username === 'admin' && password === 'admin') {
      user = { username, role: 'ADMIN' };
    }

    if (!user) {
      setError('Invalid credentials');
      return;
    }

    sessionStorage.setItem('user', JSON.stringify(user));
    navigate(user.role === 'ADMIN' ? '/admin' : '/customer');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" gutterBottom>Banking System</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button fullWidth variant="contained" onClick={handleLogin} sx={{ mt: 3 }}>
            Login
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Customer: cust1/pass | Admin: admin/admin
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

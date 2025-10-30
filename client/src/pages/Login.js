import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4">Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" name="email" label="Email" onChange={handleChange} />
          <TextField fullWidth margin="normal" name="password" label="Password" type="password" onChange={handleChange} />
          <Button fullWidth variant="contained" type="submit">Login</Button>
        </form>
        <Button onClick={() => navigate('/signup')}>Don't have an account? Sign Up</Button>
      </Box>
    </Container>
  );
};

export default Login;

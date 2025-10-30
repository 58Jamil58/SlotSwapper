import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4">Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" name="name" label="Name" onChange={handleChange} />
          <TextField fullWidth margin="normal" name="email" label="Email" onChange={handleChange} />
          <TextField fullWidth margin="normal" name="password" label="Password" type="password" onChange={handleChange} />
          <Button fullWidth variant="contained" type="submit">Sign Up</Button>
        </form>
        <Button onClick={() => navigate('/login')}>Already have an account? Login</Button>
      </Box>
    </Container>
  );
};

export default Signup;

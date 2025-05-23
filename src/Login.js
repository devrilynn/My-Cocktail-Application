import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from './NavBar';
import './Login.css';

// Login component that handles user authentication
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle changes to input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password } = formData;

  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      email,
      password,
    });

    const { id, firstName } = response.data.user;
    const user = {
      id,
      firstName,
    };
    
    sessionStorage.setItem('user', JSON.stringify(user));

    navigate('/'); 
  } catch (err) {
    setError(err.response?.data?.message || 'An error occurred');
  }
};

  return (
    <div>
      <NavBar />
      <div className="login-container">
        <h1>Hello</h1>
        <p>Sign in to ElixirMixer</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;

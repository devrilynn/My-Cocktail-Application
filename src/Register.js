import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from './NavBar';
import './Register.css'; 

// Register Component
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });      // Update formData state based on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, dateOfBirth, email, password, confirmPassword } = formData;

     // Calculate the age of the user
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust the age if the birth date hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 21) {
      setError('You must be at least 21 years old to register.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        firstName,
        lastName,
        dateOfBirth,
        email,
        password
      });                       
      alert(response.data.message);  
      navigate('/login');
    } catch (err) {
      // Ensure that error is always a string
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="register-container">
        <h1>Create an ElixirMixer Account</h1>
        <p>Fill out the details below to start saving cocktails.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
  );
};

export default Register;

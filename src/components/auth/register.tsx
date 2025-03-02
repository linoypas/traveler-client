import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css'; 
import logo from '../../assets/logo.png'; 

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:3001/auth/register',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if(response.ok) {
        console.log('Registering with:', email, password);
        navigate('/login');
      } else {
        console.log('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during register:', error);
    }
  };

  return (
<div className="login-container">
      <div className="logo-container">
      <img src={logo} alt="Logo" className="logo" />
      </div>
      
      <h2>Register</h2>
      
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">Login</button>
      </form>
      
      <p className="register-link">
        Already have an account?<button onClick={() => navigate('/login')} className="register-button">Register here</button>
      </p>
    </div>
  );
};

export default Register;

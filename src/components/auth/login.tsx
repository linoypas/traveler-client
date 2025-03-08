import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css'; 
import logo from '../../assets/logo.png'; 

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Error from server:\n ${errorMessage}`);
      } else {
        console.log('Logging in with:', email, password);
        const data = await response.json();
        if(data){
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('id',data._id);
          localStorage.setItem('refreshToken',data.refreshToken);
        }
        navigate('/posts');
      }
    } catch (error: any) {
      console.error('Error during login:', error.message);
      alert(`Error during register: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
          <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          </div>
          
          <h2>Login</h2>
          
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
            <button type="submit" className="submit-button">Register</button>
          </form>
          
          <p className="register-link">
            Don't have an account?<button onClick={() => navigate('/register')} className="register-button">Register here</button>
          </p>
        </div>
      );
    };

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      <p>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </p>
    </div>
  );
}

export default Login;

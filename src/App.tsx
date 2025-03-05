import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import CreatePost from './components/posts/createPost';
import Post from './components/posts/post';
import Header from './components/header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts/:postId" element={<Post />} />
      </Routes>
    </Router>
  );
}

export default App;

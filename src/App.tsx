import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import CreatePost from './components/posts/createPost';
import Post from './components/posts/post';
import Header from './components/header';
import Comments from './components/posts/comments';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/comments/:postId" element={<Comments />} />

      </Routes>
    </Router>
  );
}

export default App;

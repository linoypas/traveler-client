import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Post() {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/posts",
        {
          title: "My Post", 
          content: content });
      if (response.status === 201) {
        console.log('Post created');
        navigate('/posts');
      } else {
        console.log('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <h2>{ 'Create Post'}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
        <button type="submit">{'Create Post'}</button>
      </form>
    </div>
  );
}

export default Post;

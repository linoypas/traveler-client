import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Post() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content
          //photo: photo
        }),
      });

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
      <h2>{'Create Post'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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

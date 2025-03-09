import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CreatePost = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    console.log("Sending FormData:", {
      title,
      content,
      image: image?.name || "No Image",
    });
    
    try {
      const response = await fetch("http://localhost:3001/posts",{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
        });

      if (response.status === 201) {
        console.log('Post created');
        const data = await response.json();
        navigate(`/posts/${data._id}`);
      } else {
        console.log('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
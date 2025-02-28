import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CommentProps {
  comment: string;
}

function Comment({ comment }: CommentProps) {
  return <div className="comment">{comment}</div>;
}

function Post() {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/posts', { content, photo });
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

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put('http://localhost:3001/posts/1', { content, photo });
      if (response.status === 200) {
        console.log('Post updated');
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:3001/posts/1');
      if (response.status === 200) {
        console.log('Post deleted');
        navigate('/posts');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h2>{editing ? 'Edit Post' : 'Create Post'}</h2>
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
        <button type="submit">{editing ? 'Update Post' : 'Create Post'}</button>
      </form>
      {editing && <button onClick={handleEdit}>Save Changes</button>}
      <button onClick={handleDelete}>Delete Post</button>
      <div className="comments">
        {comments.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
        <input
          type="text"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
}

export default Post;

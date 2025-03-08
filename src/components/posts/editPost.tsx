import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface IPost {
  _id: string;
  title: string;
  owner: string;
  content: string;
}

const EditPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching post', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post) return;

    const updatedPost = {
      title,
      content,
    };

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error('Error updating post', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100"><p className="text-lg text-gray-600 animate-pulse">Loading...</p></div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center h-screen bg-gray-100"><p className="text-lg text-red-500">Post not found</p></div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
            />
          </div>
          <div className="flex justify-center space-x-4 w-full">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;

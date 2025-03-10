import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/posts.css'

interface IPost {
  _id: string;
  title: string;
  owner: string;
  content: string;
  likes: string[];
}

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('id');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postsReponse = await fetch(`http://localhost:3001/posts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!postsReponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postsData = await postsReponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []); 

  const isImage = (content: string) => {
    return /\.(jpeg|jpg|png|gif|webp)$/i.test(content);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl shadow-lg overflow-hidden break-inside-avoid-column">
              {isImage(post.content) ? (
                <img src={post.content} alt={post.title} className="w-full h-auto rounded-t-2xl" />
              ) : (
                <p className="p-4 text-gray-700">{post.content}</p>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold">
                  <Link to={`/posts/${post._id}`} className="text-blue-600 hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500">By: {post.owner || 'Unknown'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

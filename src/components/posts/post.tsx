import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { FaHeart, FaRegHeart , FaTrash, FaEdit} from 'react-icons/fa'; 
import '../../styles/post.css'

interface IPost {
  id: string;
  title: string;
  owner: string;
  content: string;
  likes: string[];
  image?: string;
}

const Post = () => {
  const { postId } = useParams<{ postId: string }>();
  const [comments, setComments] = useState<any[]>([]);
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate();

  const userId = localStorage.getItem('id');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postReponse = await fetch(`http://localhost:3001/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!postReponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData = await postReponse.json();
        setPost(postData);
        setLikes(postData.likes.length);
        if (postData.likes.includes(userId)) {
          setIsLiked(true);
        }
        const commentResponse = await fetch(`http://localhost:3001/comments?postId=${postId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!commentResponse.ok) {
          throw new Error('Failed to fetch comments');
        }
        const commentsData = await commentResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching post ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async (e: any) => {
    e.preventDefault();
    if (!post || !userId) return;
    let updatedLikes = [...post.likes];
    if (isLiked) {
      updatedLikes = updatedLikes.filter((id) => id !== userId);
    } else {
      updatedLikes.push(userId);
    }
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: updatedLikes }),
      });
      if (!response.ok) {
        console.error('Failed to update likes');
      }
      setIsLiked(!isLiked);
      setLikes(updatedLikes.length);
      setPost({ ...post, likes: updatedLikes });
    } catch (error) {
      console.error('Error updating likes', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to delete post');
        } else {
          navigate('/posts'); 
        }
      } catch (error) {
        console.error('Error deleting post', error);
      }
    }
  };
  const handleEdit = async () => {
    navigate(`/posts/edit/${postId}`);
  };

  if (!post || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-gray-300 hover:shadow-xl transition-all duration-500">
        <h3 className="text-5xl font-extrabold text-center p-8 text-gray-800 tracking-wide">{post.title}</h3>
        <p className="text-lg text-center text-gray-600 mb-6">By: {post.owner || 'Unknown'}</p>

        {post.owner === userId && (
          <div className="flex justify-center space-x-6 mb-6">
            <button onClick={handleEdit} className="text-blue-600 hover:text-blue-800 transition duration-200 transform hover:scale-110">
              <FaEdit className="text-3xl" />
            </button>
            <button onClick={handleDelete} className="text-red-600 hover:text-red-800 transition duration-200 transform hover:scale-110">
              <FaTrash className="text-3xl" />
            </button>
          </div>
        )}

        {post.image ? (
          <div className="post-image-container">
            <img
              src={`http://localhost:3001${post.image}`}
              alt="Post content"
            />
          </div>
        ) : (
          <p className="p-6 text-lg text-gray-700">{post.content}</p>
        )}

        <div className="p-6 flex justify-between items-center space-x-6">
          <button
            onClick={handleLike}
            className="flex items-center text-red-600 hover:text-red-800 transition duration-300 transform hover:scale-110"
          >
            {isLiked ? (
              <FaHeart className="text-3xl" />
            ) : (
              <FaRegHeart className="text-3xl" />
            )}
            <span className="ml-3 font-semibold text-xl">{likes} Likes</span>
          </button>
          <a href={`/comments/${postId}`} className="text-blue-600 hover:text-blue-800 text-lg font-semibold transition duration-300 transform hover:scale-110">
            {comments.length} Comments
          </a>
        </div>
      </div>
    </div>
  );
};
export default Post;

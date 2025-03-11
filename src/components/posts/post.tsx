import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { FaHeart, FaRegHeart , FaTrash, FaEdit} from 'react-icons/fa'; 

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


 // const isImage = (content: string) => {
 //   return /\.(jpeg|jpg|png|gif|webp)$/i.test(content);
//};

  if (!post || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all duration-300">
        <h3 className="text-4xl font-semibold p-4">{post.title}</h3>
        <p className="text-lg text-gray-600">By: {post.owner || 'Unknown'}</p>
        {post.owner === userId && (
            <div className="flex space-x-4">
              <button onClick={handleEdit} className="text-blue-600 hover:underline">
                <FaEdit className="text-2xl" />
              </button>
              <button onClick={handleDelete} className="text-red-600 hover:underline">
                <FaTrash className="text-2xl" />
              </button>
            </div>
          )}

        {post.image ? (
        <div className="w-full h-48 relative mt-4">
            <img
              src={`http://localhost:3001${post.image}`}
              alt="Post content"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        ) : (
          <p className="p-4 text-gray-700">{post.content}</p>
        )}

        <div className="p-4 flex justify-between w-full items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center text-red-600 hover:underline"
          >
            {isLiked ? (
              <FaHeart className="text-2xl" /> 
            ) : (
              <FaRegHeart className="text-2xl" /> 
            )}
            <span className="ml-2">  {likes} Likes</span>
          </button>
          <a href={`/comments/${postId}`} className="text-blue-600 hover:underline">
            {comments.length} Comments
          </a>
        </div>
      </div>
    </div>
  );
};

export default Post;

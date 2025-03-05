import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

  interface IPost {
    _id: string;
    title: string;  
    owner: String;
    content: string;
    likes: string [];
  }
  

const Posts = () => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('id'); 
    const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        const fetchPost = async () => {
          try {
            const postsReponse = await fetch(`http://localhost:3001/posts`,{
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
            console.error("Error fetching post ", error);
          } finally {
            setLoading(false);
          }

        };
    
        fetchPost();
      }, []); 
    
    const isImage = (content: string) => {
        return /\.(jpeg|jpg|png|gif|webp)$/i.test(content);
    };
    if (!posts || loading) {
        return <p>Loading...</p>; 
    }
    return (
    <div>
         <h1>All Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
        <div key={post._id} className="post">
            <h2>
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
            </h2>
            <p><strong>By: {post.owner || 'Unknown'}</strong></p> 
            {isImage(post.content) ? (
                <img src={post.content} alt="Post content" style={{ width: '100%', height: 'auto' }} />
            ) : (
                <p>{post.content}</p>
            )} 
        </div>
        ))
      )} 
    </div>

    );
}

export default Posts;


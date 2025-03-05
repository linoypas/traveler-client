import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Comment {
    id: string;
    owner: string;
    content: string;
    postId: string;
  }
  interface IPost {
    id: string;
    title: string;  
    owner: String;
    content: string;
    likes: string [];
  }
  

const Post = () => {
    const { postId } = useParams<{ postId: string }>();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('id'); 
    const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        const fetchPost = async () => {
          try {
            const commentResponse = await fetch(`http://localhost:3001/comments?postId=${postId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!commentResponse.ok) {
                throw new Error("Failed to fetch comments");
            }
            const commentsData= await commentResponse.json();
            setComments(commentsData);

          } catch (error) {
            console.error("Error fetching post ", error);
          } finally {
            setLoading(false);
          }

        };
    
        fetchPost();
      }, [postId]); 
    
    const handleComment = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/comments/`, {
                method: "POST",
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json" },
                body: JSON.stringify({ content: comment, postId: postId }),
            });
            if (response.ok) {
                setComment(""); 
            } else {
                console.error("Failed to post comment");
            }
            } catch (error) {
                console.error("Error posting comment", error);
            };
        };
  
    if (!post || loading) {
        return <p>Loading...</p>; 
    }
    return (
    <div>
        <h3>{post.title}</h3>
        <div>
            <h4>Comments:</h4>
            {comments.length > 0 ? (
                    comments.map((comment, idx) => (
                        <div key={idx}>
                            <strong>{comment.owner}</strong>: {comment.content}
                        </div>
                    ))
                ) : (
                    <p>No comments yet</p>
                )}
        </div>
    </div>
    );
}

export default Post;

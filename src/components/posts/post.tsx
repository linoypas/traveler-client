import React, { useState, useEffect } from 'react';
interface Comment {
    id: string;
    author: string;
    content: string;
    postId: string;
  }
  interface IPost {
    id: string;
    title: string;  
    owner: String;
    content: string;
    comments: Comment[];
  }
  

const Post = (postId: string) => {
    const [comment, setComment] = useState('');
    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
          try {
            const response = await fetch(`http://localhost:3001/posts/${postId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch post');
            }
            const data = await response.json();
            setPost(data);
          } catch (error) {
            console.error("Error fetching post ", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPost();
      }, [postId]); // Re-fetch when the postId changes
    
      if (loading) return <p>Loading...</p>;

    const handleComment = async (e: any) => {
    e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/comments/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
    if (!post) {
        return <p>Loading...</p>; 
        }
    return (
    <div>
        <h3>{post.title}</h3>
        <p><strong>By: {post.owner || 'Unknown'}</strong></p> 
        <p>{post.content}</p>
        <form onSubmit={handleComment}>
        <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
        />
        <button type="submit">Post Comment</button>
        </form>
        <div>
            <h4>Comments:</h4>
            {post.comments.length > 0 ? (
            post.comments.map((comment, idx) => (
                <div key={idx}>
                <strong>{comment.author}</strong>: {comment.content}
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

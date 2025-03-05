import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Comment {
    id: string;
    owner: string;
    content: string;
    postId: string;
  }
  

const Comments = () => {
    const { postId } = useParams<{ postId: string }>();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('id'); 
    const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        const fetchComments = async () => {
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
            console.error("Error fetching comments ", error);
          } finally {
            setLoading(false);
          }

        };
    
        fetchComments();
      }, [postId]); 
    
    const handleComment = async (e: any) => {
        e.preventDefault();
        if(!userId || !postId)
            return;
        
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
                const responseData: { id: string } = await response.json();
                setComments(prevComments => [...prevComments, { id: responseData.id, owner: userId , content: comment, postId: postId }]);
            } else {
                console.error("Failed to post comment");
            }
            } catch (error) {
                console.error("Error posting comment", error);
            };
        };
  
    if ( loading) {
        return <p>Loading...</p>; 
    }
    return (
    <div>
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

export default Comments;

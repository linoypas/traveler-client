import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

  interface IPost {
    id: string;
    title: string;  
    owner: String;
    content: string;
    likes: string [];
  }

const Post = () => {
    const {postId} = useParams<{ postId: string }>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const userId = localStorage.getItem('id'); 
    const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        const fetchPost = async () => {
          try {
            const postReponse = await fetch(`http://localhost:3001/posts/${postId}`,{
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
            if(postData.likes.includes(userId)){
                setIsLiked(true);
            }
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
    
    const handleLike = async (e:any) => { 
        e.preventDefault();
        if(!post || !userId)    
            return;
        let updatedLikes= [...post.likes];
        if(isLiked){
            updatedLikes= updatedLikes.filter(id => id !== userId);
        } else {
            updatedLikes.push(userId) ;
        }
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json" },
                body: JSON.stringify({ likes: updatedLikes}),
            });
            if (!response.ok) {
                console.error("Failed to update likes");
            }
            setIsLiked(!isLiked);
            setLikes(updatedLikes.length);
            setPost({ ...post, likes: updatedLikes });

        } catch (error) {
            console.error("Error updating likes", error);
        }
    }

    const isImage = (content: string) => {
        return /\.(jpeg|jpg|png|gif|webp)$/i.test(content);
    };

    if (!post || loading) {
        return <p>Loading...</p>; 
    }
    return (
    <div>
        <h3>{post.title}</h3>
        <p><strong>By: {post.owner || 'Unknown'}</strong></p> 
        {isImage(post.content) ? (
                <img src={post.content} alt="Post content" style={{ width: '100%', height: 'auto' }} />
            ) : (
                <p>{post.content}</p>
            )} 
        <button onClick={handleLike}>
            {isLiked ? 'Unlike' : 'Like'} ({likes} Likes)
      </button>
      <div>
      <a href={`/comments/${postId}`}>{comments.length} comments</a>
        </div>
    </div>
    );
}

export default Post;

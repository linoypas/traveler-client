import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserProfile.css';
function UserProfile() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem('id'); 

    useEffect(() => {
        if (!userId) {
            console.log("No user ID found, redirecting to login...");
            navigate('/login'); 
            return;
        }

        const fetchUserData = async () => {
            try {
                const userResponse = await fetch(`http://localhost:3001/auth/${userId}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                  });
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await userResponse.json();
                setUserInfo(userData);

                const postsResponse = await fetch(`http://localhost:3001/posts?owner=${userId}`);
                if (!postsResponse.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const postsData = await postsResponse.json();
                setUserPosts(postsData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate]); 

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userInfo) {
        return <p>User not found</p>;
    }
    const handlePostClick = (postId: string) => {
        navigate(`/posts/${postId}`);
    };
    return (
<div className="profile-container">
            <h2>{userInfo.name}'s Profile</h2>
            <p>Email: {userInfo.email}</p>
            <h3>Posts:</h3>
            <div className="posts-grid">
                {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <div key={post._id} className="post-card" onClick={() => handlePostClick(post._id)}>
                            {post.photo && <img src={post.photo} alt="Post" className="post-image" />}
                            <div className="post-title">{post.content}</div>
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
}

export default UserProfile;

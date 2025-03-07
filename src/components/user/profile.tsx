import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    }, [userId, navigate]); // Re-run if userId changes

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userInfo) {
        return <p>User not found</p>;
    }

    return (
        <div>
            <h2>{userInfo.name}'s Profile</h2>
            <p>Email: {userInfo.email}</p>
            <h3>Posts:</h3>
            {userPosts.length > 0 ? (
                userPosts.map((post) => (
                    <div key={post._id} className="post">
                        <p>{post.content}</p>
                        {post.photo && <img src={post.photo} alt="Post" width="200" />}
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
}

export default UserProfile;

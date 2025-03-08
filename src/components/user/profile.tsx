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
        <div className="profile-container p-6 bg-gray-50 min-h-screen">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-semibold text-gray-800">{userInfo.name}'s Profile</h2>
                <p className="text-xl text-gray-600">Email: {userInfo.email}</p>
            </div>
            <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Posts:</h3>
            {userPosts.length === 0 ? (
                <p className="text-center text-gray-500">No posts available</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {userPosts.map((post) => (
                        <div
                            key={post._id}
                            className="post-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
                            onClick={() => handlePostClick(post._id)}
                        >
                            {post.photo ? (
                                <img
                                    src={`http://localhost:3001${post.photo}`}
                                    alt={post.title}
                                    className="w-full h-auto rounded-t-2xl"
                                />
                            ) : (
                                <p className="p-4 text-gray-700">{post.content}</p>
                            )}
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
                                <p className="text-sm text-gray-500">By: {post.owner || 'Unknown'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserProfile;

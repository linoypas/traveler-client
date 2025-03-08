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
        <>
            {/* Email Bar at the Very Top */}
            <div className="fixed top-0 left-0 w-full bg-white shadow-md py-4 text-center z-20">
                <p className="text-lg font-semibold text-gray-700">{userInfo.email}</p>
            </div>
    
            {/* Main Content - Give it padding so it's not hidden by the fixed email bar */}
            <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-200 min-h-screen pt-20">
                {/* User Profile Name */}
                <div className="text-center my-12">
                    <h2 className="text-5xl font-extrabold text-gray-800">{userInfo.name}'s Profile</h2>
                </div>
    
                {/* Posts Section */}
                <h3 className="text-3xl font-semibold mt-8 text-gray-800 mb-6">Your Posts:</h3>
                {userPosts.length === 0 ? (
                    <p className="text-center text-gray-500">No posts available</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                        {userPosts.map((post) => (
                            <div
                                key={post._id}
                                className="post-card"
                                onClick={() => handlePostClick(post._id)}
                            >
                                {post.image ? (
                                    <img
                                        src={`http://localhost:3001${post.image}`}
                                        alt={post.title}
                                        className="post-image"
                                    />
                                ) : (
                                    <div className="p-6 text-gray-700">
                                        <p>{post.content}</p>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
    
}    
export default UserProfile;

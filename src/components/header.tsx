import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { FaHome ,FaSearch} from 'react-icons/fa'; // Import FontAwesome Home icon

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('id');

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken }),
            });
            if (!response.ok) {
                throw new Error('Logout failed');
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('id');
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <header className="header">
            <div className="left">
                <Link to="/posts" className="home-link">
                    <FaHome className="home-icon" />
                </Link>
                <h2>Traveler</h2>
                <FaSearch className="search-icon" onClick={() => navigate('/ai-posts')} />
            </div>

            <div className="right">
                <nav className="nav-container">
                    <div className="user-info">
                        <span>👤</span>
                        <span>{userId || 'User'}</span>
                        {isLoggedIn ? (
                            <button onClick={handleLogout}>Logout</button>
                        ) : (
                            <Link to="/login">
                                <button>Login</button>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;

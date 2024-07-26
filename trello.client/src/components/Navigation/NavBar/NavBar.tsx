import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = '/img/avatar.png'; // Percorso dell'avatar di default
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const username = localStorage.getItem('username');
    const uid = localStorage.getItem('uid');

    return (
        <nav className="navbar">
            <h1>My Trello Clone</h1>
            {username && uid && (
                <div className="user-info" onClick={toggleMenu}>
                    <img
                        src={`/img/profiles/${uid}.jpg`}
                        alt="User profile"
                        className="profile-pic"
                        onError={handleImageError}
                    />
                    <span>{username}</span>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleProfileClick}>Profilo</button>
                            <button onClick={handleLogoutClick}>Logout</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

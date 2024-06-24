import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token from localStorage
        navigate('/Login'); // Redirect to login page
    };

    return (
        <nav className="bg-green-500 text-white p-4 font-bold relative z-50">
            <ul className="flex space-x-4">
                <li><img style={{ width: '50px', borderRadius: '50%' }} src="/img/logo.png" alt="Logo" /></li>
             
                <li className="relative group">
                    <button className="hover:text-gray-300">Tabelle</button>
                    <ul className="absolute hidden group-hover:block bg-gray-700 p-2 mt-1 z-50">
                        <li><Link to="/Workspaces" className="block white-space-no-wrap hover:text-gray-300 p-2">WorkSpaces</Link></li>



                    </ul>
                </li>

             
                <li><Link to="https://docs.google.com/spreadsheets/d/1euJdUDg3mCQ2dTxxux3d8B0sPIZZUeyq5T8UZW7_-GE/edit?gid=0#gid=0"
                    className="hover:text-gray-300"  target="_new" >Assistenza</Link></li>
                <li><button onClick={handleLogout} className="hover:text-gray-300">Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;

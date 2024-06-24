import React from 'react';
import Navbar from './NavBar';
import { Outlet } from 'react-router-dom';
interface LayoutWithNavbarProps {
    children: React.ReactNode;
}

const LayoutWithNavBar: React.FC<LayoutWithNavbarProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <div>{children}</div>
            <Outlet />
        </>
    );
};

export default LayoutWithNavBar;

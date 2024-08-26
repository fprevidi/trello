import React from 'react';
import './SideBar.css';
import BoardList from '../../BoardManagement/BoardList/BoardList';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2>Craon srl</h2>
            <BoardList />
        </div>
    );
};

export default Sidebar;

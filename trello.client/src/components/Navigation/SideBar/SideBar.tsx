import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SideBar.css';

interface Board {
    id: string;
    name: string;
}

const Sidebar: React.FC = () => {
    const fakeBoards: Board[] = [
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Board 1' },
        { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Board 2' },
        { id: '123e4567-e89b-12d3-a456-426614174002', name: 'Board 3' },
    ];

    const navigate = useNavigate();

    const handleBoardClick = (boardId: string) => {
        navigate(`/board/${boardId}`);
    };

    return (
        <div className="sidebar">
            <h2>Your Boards</h2>
            <ul>
                {fakeBoards.map(board => (
                    <li key={board.id}>
                        <button onClick={() => handleBoardClick(board.id)}>{board.name}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;

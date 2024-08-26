import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardList.css';

interface Board {
    uid: string;
    name: string;
}

const BoardList: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Funzione per recuperare i board dalla API
        const fetchBoards = async () => {
            try {
                const response = await fetch('/api/GetBoards');
                if (response.ok) {
                    const data = await response.json();
                    setBoards(data);
                } else {
                    console.error('Failed to fetch boards');
                }
            } catch (error) {
                console.error('Error fetching boards:', error);
            }
        };

        fetchBoards();
    }, []);

    const handleBoardClick = (boardId: string) => {
        navigate(`/board/${boardId}`);
    };

    return (
        <ul>
            {boards.map(board => (
                <li key={board.uid}>
                    <button className="w-full p-2 text-left bg-blue-500 text-white rounded hover:bg-blue-600"    onClick={() => handleBoardClick(board.uid)}>{board.name}</button>
                </li>
            ))}
        </ul>
    );
};

export default BoardList;

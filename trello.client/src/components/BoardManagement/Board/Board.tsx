import React, { useState } from 'react';
import './Board.css';
import List from '../../ListManagement/List/List';

interface Card {
    id: number;
    title: string;
}

interface List {
    id: number;
    title: string;
    cards: Card[];
}

const Board: React.FC = () => {
    const [lists, setLists] = useState<List[]>([]);
    const [newListTitle, setNewListTitle] = useState('');

    const handleAddList = () => {
        if (newListTitle.trim()) {
            const newList: List = {
                id: Date.now(),
                title: newListTitle,
                cards: []
            };
            setLists([...lists, newList]);
            setNewListTitle('');
        }
    };

    const handleAddCard = (listId: number, cardTitle: string) => {
        setLists(lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: [...list.cards, { id: Date.now(), title: cardTitle }]
                };
            }
            return list;
        }));
    };

    return (
        <div className="board-container">
            <h1>Benvenuto nella tua Bacheca</h1>
            <div className="lists-container">
                {lists.map(list => (
                    <List
                        key={list.id}
                        listId={list.id}
                        title={list.title}
                        cards={list.cards}
                        onAddCard={handleAddCard}
                    />
                ))}
                <div className="add-list">
                    <input
                        type="text"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        placeholder="Titolo nuova lista"
                    />
                    <button onClick={handleAddList}>Aggiungi Lista</button>
                </div>
            </div>
        </div>
    );
};

export default Board;

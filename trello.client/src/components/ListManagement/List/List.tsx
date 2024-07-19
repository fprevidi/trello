import React, { useState } from 'react';
import './List.css';
import Card from '../../CardManagement/Card/Card';

interface ListProps {
    title: string;
    cards: { id: number; title: string }[];
    onAddCard: (listId: number, cardTitle: string) => void;
    listId: number;
}

const List: React.FC<ListProps> = ({ title, cards, onAddCard, listId }) => {
    const [newCardTitle, setNewCardTitle] = useState('');

    const handleAddCard = () => {
        if (newCardTitle.trim()) {
            onAddCard(listId, newCardTitle);
            setNewCardTitle('');
        }
    };

    return (
        <div className="list">
            <h3>{title}</h3>
            {cards.map(card => (
                <Card key={card.id} title={card.title} />
            ))}
            <div className="add-card">
                <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="Titolo nuova card"
                />
                <button onClick={handleAddCard}>Aggiungi Card</button>
            </div>
        </div>
    );
};

export default List;

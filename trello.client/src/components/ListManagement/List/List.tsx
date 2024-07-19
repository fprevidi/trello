import React, { useState } from 'react';
import './List.css';
import Card from '../../CardManagement/Card/Card';
import Modal from '../../UIComponents/Modal/Modal';
import Button from '../../UIComponents/Button/Button';
import { Draggable, Droppable } from 'react-beautiful-dnd';

interface ListProps {
    title: string;
    cards: { id: number; title: string; description: string }[];
    onAddCard: (listId: number, cardTitle: string, cardDescription: string) => void;
    onDeleteCard: (listId: number, cardId: number) => void;
    listId: number;
}

const List: React.FC<ListProps> = ({ title, cards, onAddCard, onDeleteCard, listId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');

    const handleAddCard = () => {
        if (newCardTitle.trim() && newCardDescription.trim()) {
            onAddCard(listId, newCardTitle, newCardDescription);
            setNewCardTitle('');
            setNewCardDescription('');
            setIsModalOpen(false);
        }
    };

    const handleDeleteCard = (cardId: number) => {
        onDeleteCard(listId, cardId);
    };

    return (
        <div className="list">
            <h3>{title}</h3>
            <Droppable droppableId={listId.toString()} type="CARD">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="cards-container">
                        {cards.map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="card-container"
                                    >
                                        <Card
                                            title={card.title}
                                            description={card.description}
                                            onDeleteCard={() => handleDeleteCard(card.id)}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Button onClick={() => setIsModalOpen(true)} label="Aggiungi Card" />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="modal-content">
                    <h3>Nuova Card</h3>
                    <input
                        type="text"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        placeholder="Titolo nuova card"
                    />
                    <textarea
                        value={newCardDescription}
                        onChange={(e) => setNewCardDescription(e.target.value)}
                        placeholder="Descrizione nuova card"
                    />
                    <div className="modal-buttons">
                        <Button onClick={handleAddCard} label="OK" />
                        <Button onClick={() => setIsModalOpen(false)} label="Annulla" />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default List;

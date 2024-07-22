import React, { useState } from 'react';
import './List.css';
import Card from '../../CardManagement/Card/Card';
import Modal from '../../UIComponents/Modal/Modal';
import Button from '../../UIComponents/Button/Button';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ListProps {
    title: string;
    cards: { id: string; title: string; description: string }[];
    onAddCard: (listId: string, cardTitle: string, cardDescription: string) => void;
    onDeleteCard: (listId: string, cardId: string) => void;
    listId: string;
    onDeleteList: (listId: string) => void;
    onMoveListLeft: (listId: string) => void;
    onMoveListRight: (listId: string) => void;
}

const List: React.FC<ListProps> = ({
    title,
    cards,
    onAddCard,
    onDeleteCard,
    listId,
    onDeleteList,
    onMoveListLeft,
    onMoveListRight,
}) => {
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

    const handleDeleteCard = (cardId: string) => {
        onDeleteCard(listId, cardId);
    };

    return (
        <div className="list">
            <div className="list-header">
                <button className="arrow-button move-list-left" onClick={() => onMoveListLeft(listId)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h3 className="list-title">{title}</h3>
                <button className="arrow-button move-list-right" onClick={() => onMoveListRight(listId)}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
            <Droppable droppableId={listId} type="CARD">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="cards-container"
                    >
                        {cards.map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
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
                <div className="modal-overlay">
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
                </div>
            </Modal>


            <FontAwesomeIcon
                icon={faTrash}
                className="delete-icon"
                onClick={() => onDeleteList(listId)}

            />
        </div>
    );
};

export default List;

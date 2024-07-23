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
    onSaveCard: (listId: string, cardId: string, title: string, description: string) => void;
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
    onSaveCard,
    listId,
    onDeleteList,
    onMoveListLeft,
    onMoveListRight,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<{ id: string; title: string; description: string } | null>(null);

    const handleAddCard = () => {
        setSelectedCard(null); // Null indica che stiamo creando una nuova card
        setIsModalOpen(true);
    };

    const handleEditCard = (card: { id: string; title: string; description: string }) => {
        setSelectedCard(card); // Passa la card selezionata per la modifica
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleSaveCard = (id: string, title: string, description: string) => {
        if (id) {
            onSaveCard(listId, id, title, description);
        } else {
            onAddCard(listId, title, description);
        }
        handleCloseModal();
    };

    return (
        <div className="list">
            <div className="list-header">
       
                    <FontAwesomeIcon icon={faArrowLeft} onClick={() => onMoveListLeft(listId)} />

                <h3>{title}</h3>
  
                    <FontAwesomeIcon icon={faArrowRight} onClick={() => onMoveListRight(listId)} />
       
            </div>
            <Droppable droppableId={listId}>
                {(provided) => (
                    <div className="cards" ref={provided.innerRef} {...provided.droppableProps}>
                        {cards.map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => handleEditCard(card)}
                                    >
                                        <div className="card-preview">
                                            <h4>{card.title}</h4>
                                            {card.description}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Button onClick={handleAddCard} label="Aggiungi Card" />
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="modal-content">
                    <Card
                        id={selectedCard?.id || ''}
                        title={selectedCard?.title || ''}
                        description={selectedCard?.description || ''}
                        onSaveCard={handleSaveCard}
                        onEditCard={handleCloseModal}
                        onDeleteCard={() => onDeleteCard(listId, selectedCard?.id || '')}
                        isEditing={true}
                    />
                </div>
            </Modal>
            <button className="delete-list-button" onClick={() => onDeleteList(listId)}>
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
};

export default List;

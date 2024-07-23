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
    cards: { uid: string; title: string; description: string }[];
    onAddCard: (listUid: string, cardTitle: string, cardDescription: string) => void;
    onDeleteCard: (listUid: string, cardUid: string) => void;
    onSaveCard: (listUid: string, cardUid: string, title: string, description: string) => void;
    listUid: string;
    onDeleteList: (listUid: string) => void;
    onMoveListLeft: (listUid: string) => void;
    onMoveListRight: (listUid: string) => void;
}

const List: React.FC<ListProps> = ({
    title,
    cards,
    onAddCard,
    onDeleteCard,
    onSaveCard,
    listUid,
    onDeleteList,
    onMoveListLeft,
    onMoveListRight,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<{ uid: string; title: string; description: string } | null>(null);

    const handleAddCard = () => {
        setSelectedCard(null); // Null indica che stiamo creando una nuova card
        setIsModalOpen(true);
    };

    const handleEditCard = (card: { uid: string; title: string; description: string }) => {
        setSelectedCard(card); // Passa la card selezionata per la modifica
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleSaveCard = (uid: string, title: string, description: string) => {
        if (uid) {
            onSaveCard(listUid, uid, title, description);
        } else {
            onAddCard(listUid, title, description);
        }
        handleCloseModal();
    };

    return (
        <div className="list">
            <div className="list-header">
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => onMoveListLeft(listUid)} />
                <h3>{title}</h3>
                <FontAwesomeIcon icon={faArrowRight} onClick={() => onMoveListRight(listUid)} />
            </div>
            <Droppable droppableId={listUid}>
                {(provided) => (
                    <div className="cards" ref={provided.innerRef} {...provided.droppableProps}>
                        {cards.length === 0 ? (
                            <div className="empty-list-placeholder">Trascina qui una card</div>
                        ) : (
                            cards.map((card, index) => (
                                <Draggable key={card.uid} draggableId={card.uid} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card
                                                uid={card.uid}
                                                title={card.title}
                                                description={card.description}
                                                onSaveCard={(uid, title, description) => handleSaveCard(uid, title, description)}
                                                onDeleteCard={() => onDeleteCard(listUid, card.uid)}
                                                onEditCard={() => handleEditCard(card)}
                                                isEditing={selectedCard?.uid === card.uid}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Button onClick={handleAddCard} label="Aggiungi Card" />
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="modal-content">
                    <Card
                        uid={selectedCard?.uid || ''}
                        title={selectedCard?.title || ''}
                        description={selectedCard?.description || ''}
                        onSaveCard={handleSaveCard}
                        onEditCard={handleCloseModal}
                        onDeleteCard={() => onDeleteCard(listUid, selectedCard?.uid || '')}
                        isEditing={true}
                    />
                </div>
            </Modal>
            <button className="delete-list-button" onClick={() => onDeleteList(listUid)}>
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
};

export default List;

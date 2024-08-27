import React, { useState } from 'react';
import './List.css';
import Card from '../../CardManagement/Card/Card';
import Modal from '../../UIComponents/Modal/Modal';
import Button from '../../UIComponents/Button/Button';
import ConfirmModal from '../../UIComponents/ConfirmModal/ConfirmModal';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons';

interface CardData {
    uid: string;
    title: string;
    description: string;
    listUid:string,
}

interface ListProps {
    title: string;
    listUid: string;
    cards: CardData[];
    onAddCard: (listUid: string, title: string, description: string) => void;
    onEditCard: (listUid: string, cardUid: string, title: string, description: string) => void;
    onDeleteCard:(cardUid: string) => void;
    onDeleteList: (listUid: string) => void;
    onMoveListLeft: (listUid: string) => void;
    onMoveListRight: (listUid: string) => void;
}

const List: React.FC<ListProps> = ({
    title,
    listUid,
    cards,
    onAddCard,
    onEditCard,
    onDeleteCard,
    onDeleteList,
    onMoveListLeft,
    onMoveListRight,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    const handleAddCard = () => {
        setSelectedCard(null);
        setIsModalOpen(true);
    };

    const handleEditCard = (card: CardData) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleSaveCard = (listUid: string, uid: string, title: string, description: string) => {
        if (uid) {
            onEditCard(listUid, uid, title, description);
        } else {
            onAddCard(listUid, title, description);
        }
        handleCloseModal();
    };

    const openConfirmModal = (cardUid: string) => {
        setCardToDelete(cardUid);
        setConfirmModalOpen(true);
    };

    const handleDeleteCardConfirm = () => {
        if (cardToDelete) {
            onDeleteCard (cardToDelete);
            setCardToDelete(null);
        }
        setConfirmModalOpen(false);
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
                            <div className="empty-list-placeholder mt-4 mb-4">Trascina qui una card</div>
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
                                                listUid={card.listUid }
                                                onDeleteCard={() => openConfirmModal(card.uid)}
                                                onSaveCard={handleSaveCard}
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

            <Button onClick={handleAddCard} label="Aggiungi Card" variant="custom" className="bg-blue-500 text-white w-48 mt-4" />
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="modal-content">
                    <Card
                        uid={selectedCard?.uid || ''}
                        title={selectedCard?.title || ''}
                        description={selectedCard?.description || ''}
                        listUid={listUid} 
                        onSaveCard={handleSaveCard}
                        onEditCard={handleCloseModal}
                        onDeleteCard={() => handleDeleteCardConfirm()}
                        isEditing={true}
                    />
                </div>
            </Modal>
            <button className="delete-list-button" onClick={() => onDeleteList(listUid)}>
                <FontAwesomeIcon icon={faTrash} />
            </button>
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleDeleteCardConfirm}
                message="Sei sicuro di voler eliminare questa card?"
            />
        </div>
    );
};

export default List;

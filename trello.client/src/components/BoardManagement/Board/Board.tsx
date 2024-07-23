import React, { useState } from 'react';
import './Board.css';
import List from '../../ListManagement/List/List';
import Modal from '../../UIComponents/Modal/Modal';
import Button from '../../UIComponents/Button/Button';
import Notification from '../../UIComponents/Notification/Notification';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface Card {
    id: string;
    title: string;
    description: string;
}

interface BoardList {
    id: string;
    title: string;
    cards: Card[];
}

const Board: React.FC = () => {
    const [lists, setLists] = useState<BoardList[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [listCounter, setListCounter] = useState(1);
    const [cardCounter, setCardCounter] = useState(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAddList = () => {
        if (newListTitle.trim() && !lists.some(list => list.title === newListTitle)) {
            const newList: BoardList = {
                id: `list_${listCounter}`,
                title: newListTitle,
                cards: []
            };
            setLists([...lists, newList]);
            setNewListTitle('');
            setIsModalOpen(false);
            setListCounter(listCounter + 1);
        } else {
            setErrorMessage("Una lista con lo stesso titolo esiste gia'");
        }
    };

    const handleAddCard = (listId: string, cardTitle: string, cardDescription: string) => {
        setLists(lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: [...list.cards, { id: `card_${cardCounter}`, title: cardTitle, description: cardDescription }]
                };
            }
            return list;
        }));
        setCardCounter(cardCounter + 1);
    };

    const handleDeleteCard = (listId: string, cardId: string) => {
        setLists(lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: list.cards.filter(card => card.id !== cardId)
                };
            }
            return list;
        }));
    };

    const handleSaveCard = (listId: string, cardId: string, title: string, description: string) => {
        setLists(lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: list.cards.map(card => card.id === cardId ? { ...card, title, description } : card)
                };
            }
            return list;
        }));
    };

    const handleDeleteList = (listId: string) => {
        setLists(lists.filter(list => list.id !== listId));
    };

    const handleMoveListLeft = (listId: string) => {
        const index = lists.findIndex(list => list.id === listId);
        if (index > 0) {
            const newLists = [...lists];
            const [movedList] = newLists.splice(index, 1);
            newLists.splice(index - 1, 0, movedList);
            setLists(newLists);
        }
    };

    const handleMoveListRight = (listId: string) => {
        const index = lists.findIndex(list => list.id === listId);
        if (index < lists.length - 1) {
            const newLists = [...lists];
            const [movedList] = newLists.splice(index, 1);
            newLists.splice(index + 1, 0, movedList);
            setLists(newLists);
        }
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceListIndex = lists.findIndex(list => list.id === source.droppableId);
        const destinationListIndex = lists.findIndex(list => list.id === destination.droppableId);

        const sourceList = lists[sourceListIndex];
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        const destinationList = lists[destinationListIndex];
        destinationList.cards.splice(destination.index, 0, movedCard);

        const newLists = [...lists];
        newLists[sourceListIndex] = sourceList;
        newLists[destinationListIndex] = destinationList;

        setLists(newLists);
    };

    return (
        <div className="board-container">
            {errorMessage && <Notification message={errorMessage} onClose={() => setErrorMessage(null)} />}
            <Button onClick={() => setIsModalOpen(true)} label="Nuova Lista" className="new-list-button" />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="lists-container">
                    {lists.map((list) => (
                        <List
                            key={list.id}
                            listId={list.id}
                            title={list.title}
                            cards={list.cards}
                            onAddCard={handleAddCard}
                            onDeleteCard={handleDeleteCard}
                            onSaveCard={handleSaveCard}
                            onDeleteList={handleDeleteList}
                            onMoveListLeft={handleMoveListLeft}
                            onMoveListRight={handleMoveListRight}
                        />
                    ))}
                </div>
            </DragDropContext>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="modal-content">
                    <h3>Nuova Lista</h3>
                    <input
                        type="text"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        placeholder="Titolo nuova lista"
                        className="modal-input"
                    />
                    <div className="modal-buttons">
                        <Button onClick={handleAddList} label="OK" className="mr-4" />
                        <Button onClick={() => setIsModalOpen(false)} label="Annulla" />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Board;

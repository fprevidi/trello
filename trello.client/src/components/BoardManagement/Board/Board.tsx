import React, { useState } from 'react';
import './Board.css';
import List from '../../ListManagement/List/List';
import Modal from '../../UIComponents/Modal/Modal';
import Button from '../../UIComponents/Button/Button';
import Notification from '../../UIComponents/Notification/Notification';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

interface Card {
    uid: string;
    title: string;
    description: string;
}

interface BoardList {
    uid: string;
    title: string;
    cards: Card[];
}

const Board: React.FC = () => {
    const [lists, setLists] = useState<BoardList[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAddList = () => {
        if (newListTitle.trim() && !lists.some(list => list.title === newListTitle)) {
            const newList: BoardList = {
                uid: uuidv4(),
                title: newListTitle,
                cards: []
            };
            setLists([...lists, newList]);
            setNewListTitle('');
            setIsModalOpen(false);
        } else {
            setErrorMessage("Una lista con lo stesso titolo esiste già.");
        }
    };

    const handleAddCard = (listUid: string, cardTitle: string, cardDescription: string) => {
        setLists(lists.map(list => {
            if (list.uid === listUid) {
                return {
                    ...list,
                    cards: [...list.cards, { uid: uuidv4(), title: cardTitle, description: cardDescription }]
                };
            }
            return list;
        }));
    };

    const handleDeleteCard = (listUid: string, cardUid: string) => {
        setLists(lists.map(list => {
            if (list.uid === listUid) {
                return {
                    ...list,
                    cards: list.cards.filter(card => card.uid !== cardUid)
                };
            }
            return list;
        }));
    };

    const handleSaveCard = (listUid: string, cardUid: string, title: string, description: string) => {
        setLists(lists.map(list => {
            if (list.uid === listUid) {
                return {
                    ...list,
                    cards: list.cards.map(card => card.uid === cardUid ? { ...card, title, description } : card)
                };
            }
            return list;
        }));
    };

    const handleDeleteList = (listUid: string) => {
        setLists(lists.filter(list => list.uid !== listUid));
    };

    const handleMoveListLeft = (listUid: string) => {
        const index = lists.findIndex(list => list.uid === listUid);
        if (index > 0) {
            const newLists = [...lists];
            const [movedList] = newLists.splice(index, 1);
            newLists.splice(index - 1, 0, movedList);
            setLists(newLists);
        }
    };

    const handleMoveListRight = (listUid: string) => {
        const index = lists.findIndex(list => list.uid === listUid);
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

        const sourceListIndex = lists.findIndex(list => list.uid === source.droppableId);
        const destinationListIndex = lists.findIndex(list => list.uid === destination.droppableId);

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
                            key={list.uid}
                            listUid={list.uid}
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

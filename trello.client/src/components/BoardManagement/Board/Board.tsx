import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Board.css';
import List from '../../ListManagement/List/List';
import Modal from '../../UIComponents/Modal/Modal';
import Button from '../../UIComponents/Button/Button';
import ConfirmModal from '../../UIComponents/ConfirmModal/ConfirmModal';
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
    const { id } = useParams<{ id: string }>();
    const [lists, setLists] = useState<BoardList[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [listToDelete, setListToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Carica i dati della bacheca specifica utilizzando l'id
        // Questo può essere sostituito con una chiamata API per ottenere i dati della bacheca
        const fetchBoardData = (boardId: string) => {
            // Simula il caricamento dei dati della bacheca
            const fakeData: BoardList[] = [
                {
                    uid: uuidv4(),
                    title: 'To Do',
                    cards: [
                        { uid: uuidv4(), title: 'Task 1', description: 'Description 1' },
                        { uid: uuidv4(), title: 'Task 2', description: 'Description 2' },
                    ]
                },
                {
                    uid: uuidv4(),
                    title: 'In Progress',
                    cards: [
                        { uid: uuidv4(), title: 'Task 3', description: 'Description 3' },
                    ]
                },
                {
                    uid: uuidv4(),
                    title: 'Done',
                    cards: [
                        { uid: uuidv4(), title: 'Task 4', description: 'Description 4' },
                    ]
                }
            ];

            // Imposta i dati fittizi come stato
            setLists(fakeData);
        };

        fetchBoardData(id!);
    }, [id]);

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

    const handleDeleteList = () => {
        if (listToDelete) {
            setLists(lists.filter(list => list.uid !== listToDelete));
            setListToDelete(null);
        }
        setConfirmModalOpen(false);
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

    const openConfirmModal = (listUid: string) => {
        setListToDelete(listUid);
        setConfirmModalOpen(true);
    };

    return (
        <div className="board-container">
            {errorMessage && <Notification message={errorMessage} onClose={() => setErrorMessage(null)} />}
            <Button onClick={() => setIsModalOpen(true)} label="Nuova Lista" variant="custom" className="new-list-button" />
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
                            onDeleteList={openConfirmModal}
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
                        <Button onClick={handleAddList} label="OK" className="mr-4 bg-red-500 text-white w-48" variant="custom" />
                        <Button onClick={() => setIsModalOpen(false)} label="ANNULLA" className="mr-4 bg-gray-500 text-white w-48" variant="custom" />
                    </div>
                </div>
            </Modal>
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleDeleteList}
                message="Sei sicuro di voler eliminare questa lista?"
            />
        </div>
    );
};

export default Board;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Board.css';
import List from '../../ListManagement/List/List';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import Modal from '../../UIComponents/Modal/Modal';
import ConfirmModal from '../../UIComponents/ConfirmModal/ConfirmModal';
import Button from '../../UIComponents/Button/Button';

interface Card {
    uid: string;
    title: string;
    description: string;
}

interface BoardList {
    uid: string;
    name: string;
    cards: Card[];
}

const Board: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [lists, setLists] = useState<BoardList[]>([]);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [listToDelete, setListToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const openConfirmModal = (listUid: string) => {
        setListToDelete(listUid);
        setConfirmModalOpen(true);
    };

    useEffect(() => {
        const fetchBoardData = async (uid: string) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/GetLists/${uid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const listsWithCards = data.map((list: BoardList) => ({
                    ...list,
                    cards: list.cards || [],
                }));

                setLists(listsWithCards);
            } catch (error) {
                console.error('Error fetching lists:', error);
                setErrorMessage('Errore durante il caricamento delle liste.');
            }
        };

        if (uid && !isDragging) {
            fetchBoardData(uid);
        }
    }, [uid, isDragging]);

    const handleAddList = async () => {
        if (newListTitle.trim() && !lists.some((list) => list.name === newListTitle)) {
            try {
                const token = localStorage.getItem('token');
                const newList: BoardList = {
                    uid: uuidv4(),
                    name: newListTitle,
                    cards: [],
                };

                const response = await fetch('/api/lists', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: newListTitle,
                        boardUid: uid,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Errore durante la creazione della lista');
                }

                const savedList = await response.json();
                setLists([...lists, { ...savedList, cards: [] }]);
                setNewListTitle('');
                setIsModalOpen(false);
            } catch (error) {
                console.error('Errore durante la creazione della lista:', error);
                setErrorMessage('Errore durante la creazione della lista.');
            }
        }
    };

    const handleDeleteList = async () => {
        if (listToDelete) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/lists/${listToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Errore durante l\'eliminazione della lista');
                }

                setLists(lists.filter((list) => list.uid !== listToDelete));
                setListToDelete(null);
                setConfirmModalOpen(false);
            } catch (error) {
                console.error('Errore durante l\'eliminazione della lista:', error);
                setErrorMessage('Errore durante l\'eliminazione della lista.');
            }
        }
    };

    const handleMoveListLeft = (listUid: string) => {
        const index = lists.findIndex((list) => list.uid === listUid);
        if (index > 0) {
            const newLists = [...lists];
            const [movedList] = newLists.splice(index, 1);
            newLists.splice(index - 1, 0, movedList);
            setLists(newLists);
        }
    };

    const handleMoveListRight = (listUid: string) => {
        const index = lists.findIndex((list) => list.uid === listUid);
        if (index < lists.length - 1) {
            const newLists = [...lists];
            const [movedList] = newLists.splice(index, 1);
            newLists.splice(index + 1, 0, movedList);
            setLists(newLists);
        }
    };

    const handleAddCard = async (listUid: string, title: string, description: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/CardCreate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listUid,
                    title,
                    description,
                }),
            });

            if (!response.ok) {
                throw new Error('Errore durante il salvataggio della card');
            }

            const savedCard = await response.json();

            setLists(lists.map((list) =>
                list.uid === listUid ? { ...list, cards: [...list.cards, savedCard] } : list
            ));
        } catch (error) {
            console.error('Errore durante il salvataggio della card:', error);
            setErrorMessage('Errore durante il salvataggio della card.');
        }
    };

    const handleEditCard = async (listUid: string, cardUid: string, title: string, description: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/CardEdit/${cardUid}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                }),
            });

            if (!response.ok) {
                throw new Error('Errore durante l\'aggiornamento della card');
            }

            const updatedCard = await response.json();

            setLists(lists.map((list) =>
                list.uid === listUid ? {
                    ...list,
                    cards: list.cards.map((card) => card.uid === cardUid ? updatedCard : card),
                } : list
            ));
        } catch (error) {
            console.error('Errore durante l\'aggiornamento della card:', error);
            setErrorMessage('Errore durante l\'aggiornamento della card.');
        }
    };

    const handleDeleteCard = async (listUid: string, cardUid: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/CardDelete/${cardUid}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Errore durante l\'eliminazione della card');
            }

            setLists(lists.map((list) =>
                list.uid === listUid ? {
                    ...list,
                    cards: list.cards.filter((card) => card.uid !== cardUid),
                } : list
            ));
        } catch (error) {
            console.error('Errore durante l\'eliminazione della card:', error);
            setErrorMessage('Errore durante l\'eliminazione della card.');
        }
    };

    const onDragStart = () => {
        setIsDragging(true);
    };

    const onDragEnd = (result: DropResult) => {
        setIsDragging(false);

        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceListIndex = lists.findIndex((list) => list.uid === source.droppableId);
        const destinationListIndex = lists.findIndex((list) => list.uid === destination.droppableId);

        if (sourceListIndex === -1 || destinationListIndex === -1) {
            console.error('List not found');
            return;
        }

        const sourceList = lists[sourceListIndex];
        const destinationList = lists[destinationListIndex];

        if (!sourceList.cards || !destinationList.cards) {
            console.error('Cards array not found in one of the lists');
            return;
        }

        const sourceCardsCopy = Array.from(sourceList.cards);
        const destinationCardsCopy = Array.from(destinationList.cards);

        const [movedCard] = sourceCardsCopy.splice(source.index, 1);

        if (!movedCard) {
            console.error('No card moved');
            return;
        }

        destinationCardsCopy.splice(destination.index, 0, movedCard);

        const newLists = [...lists];
        newLists[sourceListIndex] = { ...sourceList, cards: sourceCardsCopy };
        newLists[destinationListIndex] = { ...destinationList, cards: destinationCardsCopy };

        setLists(newLists);
    };

    return (
        <div className="board-container">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button onClick={() => setIsModalOpen(true)} className="new-list-button">Nuova Lista</button>
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="lists-container">
                    {lists.map((list) => (
                        <List
                            key={list.uid}
                            listUid={list.uid}
                            title={list.name}
                            cards={list.cards}
                            onAddCard={handleAddCard}
                            onEditCard={handleEditCard}
                            onDeleteCard={handleDeleteCard}
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

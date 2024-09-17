import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Board.css';
import List from '../../ListManagement/List/List';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Modal from '../../UIComponents/Modal/Modal';
import ConfirmModal from '../../UIComponents/ConfirmModal/ConfirmModal';
import Button from '../../UIComponents/Button/Button';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Card {
    uid: string;
    title: string;
    description: string;
    listUid: string;
}

interface BoardList {
    uid: string;
    name: string;
    cards: Card[];
}

const Board: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [lists, setLists] = useState<BoardList[]>([]);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [listToDelete, setListToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newListTitle, setNewListTitle] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const openConfirmModal = (listUid: string) => {
        setListToDelete(listUid);
        setConfirmModalOpen(true);
    };

    const fetchLists = async (boardUid: string): Promise<BoardList[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/GetLists/${boardUid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const listsWithCards: BoardList[] = data.map((list: BoardList) => ({
            ...list,
            cards: list.cards || [],
        }));

        return listsWithCards;
    };

    const {
        data,
        error,
        isLoading,
        isError,
    } = useQuery<BoardList[], Error>({
        queryKey: ['lists', uid],
        queryFn: () => fetchLists(uid!),
        enabled: !!uid && !isDragging,
    });

    useEffect(() => {
        if (data) {
            setLists(data);
        }
    }, [data]);

    useEffect(() => {
        if (isError && error) {
            console.error('Error fetching lists:', error);
            setErrorMessage('Errore durante il caricamento delle liste.');
        }
    }, [isError, error]);

    const createListMutation = useMutation<void, Error, void>({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/ListCreate', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newListTitle,
                    boardUid: uid,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Errore durante la creazione della lista');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', uid!] });
            setNewListTitle('');
            setIsModalOpen(false);
        },
        onError: (error: Error) => {
            console.error('Errore durante la creazione della lista:', error);
            setErrorMessage('Errore durante la creazione della lista.');
            Swal.fire({
                title: 'Errore',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        },
    });

    const handleAddList = () => {
        if (newListTitle.trim() && !lists.some((list) => list.name === newListTitle)) {
            createListMutation.mutate();
        }
    };

    const deleteListMutation = useMutation<void, Error, void>({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/ListDelete/${listToDelete}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Errore durante l\'eliminazione della lista');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', uid!] });
            setListToDelete(null);
            setConfirmModalOpen(false);
        },
        onError: (error: Error) => {
            console.error('Errore durante l\'eliminazione della lista:', error);
            setErrorMessage('Errore durante l\'eliminazione della lista.');
        },
    });

    const handleDeleteList = () => {
        if (listToDelete) {
            deleteListMutation.mutate();
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

    const addCardMutation = useMutation<
        void,
        Error,
        { listUid: string; title: string; description: string }
    >({
        mutationFn: async ({ listUid, title, description }) => {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/CardCreate', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listUid,
                    title,
                    description,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Errore durante il salvataggio della card');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', uid!] });

        },
        onError: (error: Error) => {
            console.error('Errore durante il salvataggio della card:', error);
            setErrorMessage('Errore durante il salvataggio della card.');
        },
    });

    const handleAddCard = (listUid: string, title: string, description: string) => {
        addCardMutation.mutate({ listUid, title, description });
    };

    const editCardMutation = useMutation<
        void,
        Error,
        { cardUid: string; title: string; description: string }
    >({
        mutationFn: async ({ cardUid, title, description }) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/CardEdit/${cardUid}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Errore durante l\'aggiornamento della card');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', uid!] });
        },
        onError: (error: Error) => {
            console.error('Errore durante l\'aggiornamento della card:', error);
            setErrorMessage('Errore durante l\'aggiornamento della card.');
        },
    });

    const handleEditCard = (cardUid: string, title: string, description: string) => {
        editCardMutation.mutate({ cardUid, title, description });
    };

    const deleteCardMutation = useMutation<void, Error, string>({
        mutationFn: async (cardUid) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/CardDelete/${cardUid}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Errore durante l\'eliminazione della card');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', uid!] });

        },
        onError: (error: Error) => {
            console.error('Errore durante l\'eliminazione della card:', error);
            setErrorMessage('Errore durante l\'eliminazione della card.');
        },
    });

    const handleDeleteCard = (cardUid: string) => {
        deleteCardMutation.mutate(cardUid);
    };

    const updateCardOrderMutation = useMutation<
        void,
        Error,
        {
            cardUid: string;
            newPosition: number;
            destinationListUid: string;
            title: string;
        }[]
    >({
        mutationFn: async (updatedCards) => {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/CardOrder', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCards),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Errore durante l\'aggiornamento dell\'ordine delle card');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', uid!] });
        },
        onError: (error: Error) => {
            console.error('Errore durante l\'aggiornamento dell\'ordine delle card:', error);
            setErrorMessage('Errore durante l\'aggiornamento dell\'ordine delle card.');
        },
    });

    const onDragStart = () => {
        setIsDragging(true);
    };

    const onDragEnd = (result: DropResult) => {
        setIsDragging(false);

        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceListIndex = lists.findIndex((list) => list.uid === source.droppableId);
        const destinationListIndex = lists.findIndex(
            (list) => list.uid === destination.droppableId
        );

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
        let newLists = [...lists];

        if (source.droppableId === destination.droppableId) {
            const [movedCard] = sourceCardsCopy.splice(source.index, 1);
            sourceCardsCopy.splice(destination.index, 0, movedCard);

            newLists[sourceListIndex] = { ...sourceList, cards: sourceCardsCopy };
        } else {
            const destinationCardsCopy = Array.from(destinationList.cards);
            const [movedCard] = sourceCardsCopy.splice(source.index, 1);

            if (!movedCard) {
                console.error('No card moved');
                return;
            }

            destinationCardsCopy.splice(destination.index, 0, movedCard);

            newLists[sourceListIndex] = { ...sourceList, cards: sourceCardsCopy };
            newLists[destinationListIndex] = { ...destinationList, cards: destinationCardsCopy };
        }

        setLists(newLists);

        const updatedCards = newLists.flatMap((list) =>
            list.cards.map((card, index) => ({
                cardUid: card.uid,
                newPosition: index,
                destinationListUid: list.uid,
                title: card.title,
            }))
        );

        updateCardOrderMutation.mutate(updatedCards);
    };

    return (
        <div className="board-container">
            {/* {errorMessage && <div className="error-message">{errorMessage}</div>} */}
            <button onClick={() => setIsModalOpen(true)} className="new-list-button">
                Nuova Lista
            </button>
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



           {/*Modale per nuovalista*/}
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
                        <Button
                            onClick={handleAddList}
                            label="OK"
                            className="mr-4 bg-red-500 text-white w-48"
                            variant="custom"
                        />
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            label="ANNULLA"
                            className="mr-4 bg-gray-500 text-white w-48"
                            variant="custom"
                        />
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

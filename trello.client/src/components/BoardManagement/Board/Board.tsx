import React, { useState } from 'react';
import './Board.css';
import List from '../../ListManagement/List/List';
import Modal from '../../UIComponents/Modal/Modal';
import Button from '../../UIComponents/Button/Button';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

interface Card {
    id: number;
    title: string;
    description: string;
}

interface BoardList {
    id: number;
    title: string;
    cards: Card[];
}

const Board: React.FC = () => {
    const [lists, setLists] = useState<BoardList[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    const handleAddList = () => {
        if (newListTitle.trim()) {
            const newList: BoardList = {
                id: Date.now(),
                title: newListTitle,
                cards: []
            };
            setLists([...lists, newList]);
            setNewListTitle('');
            setIsModalOpen(false);
        }
    };

    const handleAddCard = (listId: number, cardTitle: string, cardDescription: string) => {
        setLists(lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: [...list.cards, { id: Date.now(), title: cardTitle, description: cardDescription }]
                };
            }
            return list;
        }));
    };

    const handleDeleteCard = (listId: number, cardId: number) => {
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

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceListIndex = lists.findIndex(list => list.id.toString() === source.droppableId);
        const destinationListIndex = lists.findIndex(list => list.id.toString() === destination.droppableId);

        const sourceList = lists[sourceListIndex];
        const [removed] = sourceList.cards.splice(source.index, 1);
        const destinationList = lists[destinationListIndex];
        destinationList.cards.splice(destination.index, 0, removed);

        const newLists = [...lists];
        newLists[sourceListIndex] = sourceList;
        newLists[destinationListIndex] = destinationList;

        setLists(newLists);
    };

    return (
        <div className="board-container">
            <Button onClick={() => setIsModalOpen(true)} label="Nuova Lista" className="new-list-button" />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="lists-container">
                    {lists.map(list => (
                        <Droppable key={list.id} droppableId={list.id.toString()}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="list-container"
                                >
                                    <List
                                        listId={list.id}
                                        title={list.title}
                                        cards={list.cards}
                                        onAddCard={handleAddCard}
                                        onDeleteCard={handleDeleteCard}
                                    />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
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
                    />
                    <div className="modal-buttons">
                        <Button onClick={handleAddList} label="OK" />
                        <Button onClick={() => setIsModalOpen(false)} label="Annulla" />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Board;

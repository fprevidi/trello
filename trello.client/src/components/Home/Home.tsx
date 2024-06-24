import React, { useState } from 'react';
import './Home.css';
import Card from '../Card/Card';
import DivDialog from '../DivDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable, DraggableProvided, DroppableProvided, DropResult } from 'react-beautiful-dnd';

interface Card {
    id: number;
    title: string;
    description: string;
}

interface List {
    id: number;
    name: string;
    cards: Card[];
}

const Home: React.FC = () => {
    const [lists, setLists] = useState<List[]>([]);
    const [newListName, setNewListName] = useState('');
    const [isAddingList, setIsAddingList] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const handleAddList = () => {
        if (newListName.trim()) {
            setLists([...lists, { id: lists.length + 1, name: newListName, cards: [] }]);
            setNewListName('');
            setIsAddingList(false);
        }
    };

    const handleAddCard = () => {
        if (newCardTitle.trim() && newCardDescription.trim() && selectedListId !== null) {
            const updatedLists = lists.map((list) => {
                if (list.id === selectedListId) {
                    return {
                        ...list,
                        cards: [...list.cards, { id: list.cards.length + 1, title: newCardTitle, description: newCardDescription }],
                    };
                }
                return list;
            });
            setLists(updatedLists);
            setNewCardTitle('');
            setNewCardDescription('');
            setSelectedListId(null);
            setIsDialogOpen(false);
        }
    };

    const handleCardClick = (card: Card) => {
        setSelectedCard(card);
        setIsDialogOpen(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedCard) {
            setSelectedCard({ ...selectedCard, title: e.target.value });
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (selectedCard) {
            setSelectedCard({ ...selectedCard, description: e.target.value });
        }
    };

    const handleSaveChanges = () => {
        if (selectedCard) {
            const updatedLists = lists.map((list) => {
                return {
                    ...list,
                    cards: list.cards.map((card) => (card.id === selectedCard.id ? selectedCard : card)),
                };
            });
            setLists(updatedLists);
            setIsEditingTitle(false);
            setIsEditingDescription(false);
            setIsDialogOpen(false);
        }
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // Do nothing if dropped outside the list
        if (!destination) {
            return;
        }

        const sourceListIndex = lists.findIndex((list) => list.id.toString() === source.droppableId);
        const destinationListIndex = lists.findIndex((list) => list.id.toString() === destination.droppableId);

        const sourceList = lists[sourceListIndex];
        const destinationList = lists[destinationListIndex];

        const [movedCard] = sourceList.cards.splice(source.index, 1);

        if (sourceListIndex === destinationListIndex) {
            sourceList.cards.splice(destination.index, 0, movedCard);
            const updatedLists = [...lists];
            updatedLists[sourceListIndex] = sourceList;
            setLists(updatedLists);
        } else {
            destinationList.cards.splice(destination.index, 0, movedCard);
            const updatedLists = [...lists];
            updatedLists[sourceListIndex] = sourceList;
            updatedLists[destinationListIndex] = destinationList;
            setLists(updatedLists);
        }
    };

    return (
        <div className="home">
            <header className="menu">
                <h1>Your Trello-Like App</h1>
                <button className="add-list-button" onClick={() => setIsAddingList(true)}>
                    Nuova Lista
                </button>
            </header>
            {isAddingList && (
                <div className="new-list-modal">
                    <div className="new-list-content">
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="Enter list name"
                        />
                        <button onClick={handleAddList}>Add List</button>
                        <button onClick={() => setIsAddingList(false)}>Cancel</button>
                    </div>
                </div>
            )}
            <DivDialog
                title={selectedCard ? selectedCard.title : "Add a new card"}
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                content={
                    selectedCard ? (
                        <div className="card-details">
                            <div className="card-detail-title">
                                {isEditingTitle ? (
                                    <input type="text" value={selectedCard.title} onChange={handleTitleChange} />
                                ) : (
                                    <h3>{selectedCard.title}</h3>
                                )}
                                <FontAwesomeIcon icon={faPen} onClick={() => setIsEditingTitle(true)} />
                            </div>
                            <div className="card-detail-description">
                                {isEditingDescription ? (
                                    <textarea value={selectedCard.description} onChange={handleDescriptionChange} />
                                ) : (
                                    <p>{selectedCard.description}</p>
                                )}
                                <FontAwesomeIcon icon={faPen} onClick={() => setIsEditingDescription(true)} />
                            </div>
                            <button onClick={handleSaveChanges}>Save Changes</button>
                        </div>
                    ) : (
                        <div className="new-card-content">
                            <input
                                type="text"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                placeholder="Enter card title"
                            />
                            <textarea
                                value={newCardDescription}
                                onChange={(e) => setNewCardDescription(e.target.value)}
                                placeholder="Enter card description"
                            />
                            <button onClick={handleAddCard}>Add Card</button>
                            <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
                        </div>
                    )
                }
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="lists-container">
                    {lists.map((list) => (
                        <Droppable key={list.id} droppableId={list.id.toString()}>
                            {(provided: DroppableProvided) => (
                                <div
                                    className="list"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <h2>{list.name}</h2>
                                    <button className="add-card-button" onClick={() => {
                                        setSelectedListId(list.id);
                                        setIsDialogOpen(true);
                                        setSelectedCard(null); // Clear selected card to show the new card form
                                    }}>
                                        + Add Card
                                    </button>
                                    {list.cards.map((card, index) => (
                                        <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                                            {(provided: DraggableProvided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Card title={card.title} description={card.description} onClick={() => handleCardClick(card)} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Home;

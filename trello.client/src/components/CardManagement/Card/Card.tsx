import React, { useState, useEffect } from 'react';
import './Card.css';
import Comments from '../Comments/Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface CardProps {
    uid: string;
    title: string;
    description: string;
    listUid: string; // Aggiungi questa prop per passare il GUID della lista
    onDeleteCard: () => void;
    onSaveCard: (listUid:string,uid: string, title: string, description: string) => void;
    onEditCard: () => void;
    isEditing: boolean;
}

const Card: React.FC<CardProps> = ({
    uid,
    title: initialTitle,
    description: initialDescription,
    listUid,
    onDeleteCard,
    onSaveCard,
    onEditCard,
    isEditing,
}) => {
    const [editTitle, setEditTitle] = useState(initialTitle);
    const [editDescription, setEditDescription] = useState(initialDescription);

    useEffect(() => {
        setEditTitle(initialTitle);
        setEditDescription(initialDescription);
    }, [initialTitle, initialDescription]);

    const handleSaveCard = () => {
        onSaveCard(listUid,uid, editTitle, editDescription);
        onEditCard();
    };

    return (
        <div>
       
            {isEditing ? (
                <div className="card-edit">
                  <div>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Titolo"
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Descrizione"
                    />
                    <Comments cardId={uid} />
                    <div className="modal-buttons">
                        <button onClick={handleSaveCard} className="modal-button save-button">Conferma</button>
                        <button onClick={onEditCard} className="modal-button save-button">Annulla</button>
                    </div>
                    </div>
                </div>
            ) : (
                    <div className="card">
                            <div>
                                <div className="card-content" onClick={onEditCard}>
                                    <h4>{initialTitle}</h4>
                                    <p>{initialDescription}</p>
                                </div>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="delete-card-icon"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Previene l'attivazione dell'edit
                                        onDeleteCard();
                                    }}
                                    style={{ color: 'red', position: 'absolute', bottom: '10px', right: '10px' }}
                                />
                        </div>
                </div>
            )}
            </div>
     
    );
};

export default Card;

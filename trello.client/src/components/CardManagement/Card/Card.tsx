import React, { useState, useEffect } from 'react';
import './Card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface Comment {
    id: string;
    comment: string;
    uid: string;
}

interface CardProps {
    id: string;
    title: string;
    description: string;
    onDeleteCard: () => void;
    onSaveCard: (id: string, title: string, description: string) => void;
    onEditCard: () => void;
    isEditing: boolean;
}

const Card: React.FC<CardProps> = ({
    id,
    title: initialTitle,
    description: initialDescription,
    onDeleteCard,
    onSaveCard,
    onEditCard,
    isEditing,
}) => {
    const [editTitle, setEditTitle] = useState(initialTitle);
    const [editDescription, setEditDescription] = useState(initialDescription);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setEditTitle(initialTitle);
        setEditDescription(initialDescription);
    }, [initialTitle, initialDescription]);

    useEffect(() => {
        if (isEditing) {
            // Simula il caricamento dei commenti
            const loadComments = () => {
                const mockComments: Comment[] = [
                    { id: 'comment_1', comment: 'Questo è un commento', uid: 'user_1' },
                    { id: 'comment_2', comment: 'Questo è un altro commento', uid: 'user_2' }
                ];
                setComments(mockComments);
            };

            loadComments();
        }
    }, [isEditing]);

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newCommentObj = { id: `comment_${new Date().getTime()}`, comment: newComment, uid: 'current_user' };
            setComments([...comments, newCommentObj]);
            setNewComment('');
        }
    };

    const handleDeleteComment = (commentId: string) => {
        setComments(comments.filter(comment => comment.id !== commentId));
    };

    const handleSaveCard = () => {
        onSaveCard(id, editTitle, editDescription);
        onEditCard();
    };

    return (
        <div className="card">
            {isEditing ? (
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
                    <div className="comments-section">
                        {comments.map(comment => (
                            <div key={comment.id} className="comment">
                                {comment.comment}
                                <FontAwesomeIcon icon={faTrash} className="delete-comment-icon" onClick={() => handleDeleteComment(comment.id)} />
                            </div>
                        ))}
                        <div className="add-comment">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Aggiungi un commento..."
                                className="comment-textarea"
                            />
                            <button onClick={handleAddComment} className="add-comment-button">Conferma</button>
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button onClick={handleSaveCard} className="modal-button save-button">Conferma</button>
                        <button onClick={onEditCard} className="modal-button cancel-button">Annulla</button>
                    </div>
                </div>
            ) : (
                <div onClick={onEditCard}>
                    <h4>{initialTitle}</h4>
                    <p>{initialDescription}</p>
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
            )}
        </div>
    );
};

export default Card;

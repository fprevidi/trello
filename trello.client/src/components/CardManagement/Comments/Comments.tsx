import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './Comments.css';

interface Comment {
    id: string;
    comment: string;
    uid: string;
}

interface CommentsProps {
    cardId: string;
}

const Comments: React.FC<CommentsProps> = ({ cardId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // Caricamento dei commenti dalla API
        const loadComments = async () => {
            try {
                const response = await fetch(`/api/GetCommentS?cardId=${cardId}`);
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        loadComments();
    }, [cardId]);

    const handleAddComment = async () => {
        if (newComment.trim()) {
            const newCommentObj = { cardId, comment: newComment, uid: 'current_user' };

            try {
                const response = await fetch('/api/CommentCreate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newCommentObj),
                });

                if (response.ok) {
                    const addedComment = await response.json();
                    setComments([...comments, addedComment]);
                    setNewComment('');
                }
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            // Supponiamo che ci sia un endpoint per eliminare il commento
            const response = await fetch(`/api/CardsComment/${commentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setComments(comments.filter(comment => comment.id !== commentId));
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
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
    );
};

export default Comments;

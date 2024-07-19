import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './Card.css';

interface CardProps {
    title: string;
    description: string;
    onDeleteCard: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onDeleteCard }) => {
    return (
        <div className="card">
            <div className="card-content">
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
            <FontAwesomeIcon
                icon={faTrash}
                className="delete-icon"
                onClick={onDeleteCard}
            />
        </div>
    );
};

export default Card;

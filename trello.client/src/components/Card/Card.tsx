import React from 'react';
import './Card.css';

interface CardProps {
    title: string;
    description: string;
    onClick: () => void; // Aggiungi questa prop
}

const Card: React.FC<CardProps> = ({ title, description, onClick }) => {
    return (
        <div className="card" onClick={onClick}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default Card;

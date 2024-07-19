import React from 'react';
import './Card.css';

interface CardProps {
    title: string;
}

const Card: React.FC<CardProps> = ({ title }) => {
    return (
        <div className="card">
            <p>{title}</p>
        </div>
    );
};

export default Card;

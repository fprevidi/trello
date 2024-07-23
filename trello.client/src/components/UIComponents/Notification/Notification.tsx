import React from 'react';
import './Notification.css';

interface NotificationProps {
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    return (
        <div className="notification">
            <span>{message}</span>
            <button onClick={onClose} className="close-button">X</button>
        </div>
    );
};

export default Notification;

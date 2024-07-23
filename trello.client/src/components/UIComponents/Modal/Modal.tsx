import React from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation(); // Previene la chiusura del modal quando si clicca all'interno del contenuto del modal
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={handleClose}>
                {children}
            </div>
        </div>
    );
};

export default Modal;

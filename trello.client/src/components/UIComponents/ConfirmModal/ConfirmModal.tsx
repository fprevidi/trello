import React from 'react';
import './ConfirmModal.css';
import Modal from '../../UIComponents/Modal/Modal';
import Button from '../../UIComponents/Button/Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="confirm-modal-content">
                <p>{message}</p>
                <div className="confirm-modal-buttons">
                    <Button
                        onClick={onConfirm}
                        label="Conferma"
                        className="bg-red-500 mr-4 text-white hover:bg-red-700 px-4 py-2"
                        variant="custom"
                    />
                    <Button
                        onClick={onClose}
                        label="Annulla"
                        variant="custom"
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;

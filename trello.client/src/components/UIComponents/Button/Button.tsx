import React from 'react';
import './Button.css';

interface ButtonProps {
    onClick: () => void;
    label: string;
    className?: string;
    variant?: 'default' | 'custom';
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className, variant = 'default' }) => {
    const buttonClass = variant === 'custom' ? className : 'custom-button';

    return (
        <button className={buttonClass} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;

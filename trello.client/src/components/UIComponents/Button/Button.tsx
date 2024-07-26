import React from 'react';
import './Button.css';

interface ButtonProps {
    onClick?: () => void;
    label: string;
    className?: string;
    variant?: 'default' | 'custom';
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className, variant = 'default', type = 'button' }) => {
    const buttonClass = variant === 'custom' ? className : 'custom-button';

    return (
        <button type={type} className={buttonClass} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;

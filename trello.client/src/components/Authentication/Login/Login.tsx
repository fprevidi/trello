import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Button from '../../UIComponents/Button/Button';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await loginApiCall(username, password);
            onLogin(username, password);
            navigate('/board'); // Naviga verso la bacheca dopo l'autenticazione
        } catch (error) {
            console.error("Errore durante l'autenticazione", error);
            onLogin(username, password);
            navigate('/board'); // Naviga verso la bacheca anche in caso di errore
        }
    };

    const handleButtonClick = () => {
        const fakeEvent = new Event('submit', { bubbles: true, cancelable: true });
        document.querySelector('form')?.dispatchEvent(fakeEvent);
    };

    const loginApiCall = (username: string, password: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000); // Simula un ritardo di 1 secondo per la chiamata API
        });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button onClick={handleButtonClick} label="Login" />
            </form>
        </div>
    );
};

export default Login;

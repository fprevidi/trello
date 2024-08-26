import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Button from '../../UIComponents/Button/Button';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        // Simulazione di una risposta positiva
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Salva il token
            localStorage.setItem('uid', data.uid); // Salva l'UID
            localStorage.setItem('username', data.username); // Salva lo username
            navigate('/home');
        } else {
           setErrMessage(response.statusText);
        }
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
                <Button type="submit" label="Login" variant="custom" /><br></br>
               
                <span className="text-red-500">{errMessage}</span>
            </form>
        </div>
    );
};

export default Login;

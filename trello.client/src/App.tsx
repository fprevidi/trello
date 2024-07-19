import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Authentication/Login/Login';
import Register from './components/Authentication/Register/Register';
import Board from './components/BoardManagement/Board/Board';
import NavBar from './components/Navigation/NavBar/NavBar';
import SideBar from './components/Navigation/SideBar/SideBar';
import './App.css';

const App: React.FC = () => {
    const handleLogin = (username: string, password: string) => {
        console.log('Login', { username, password });
    };

    const handleRegister = (username: string, password: string, email: string) => {
        console.log('Register', { username, password, email });
    };

    return (
        <Router>
            <div className="app">
                <NavBar />
                <div className="app-body">
                    <SideBar />
                    <div className="app-content">
                        <Routes>
                            <Route path="/" element={<Login onLogin={handleLogin} />} />
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/register" element={<Register onRegister={handleRegister} />} />
                            <Route path="/board" element={<Board />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Authentication/Login/Login';
import Profile from './components/Authentication/Profile/Profile';
import Board from './components/BoardManagement/Board/Board';
import NavBar from './components/Navigation/NavBar/NavBar';
import SideBar from './components/Navigation/SideBar/SideBar';
import './App.css';
import Home from './components/Home/Home';

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="app">
                    <NavBar />
                    <div className="app-body">
                        <SideBar />
                        <div className="app-content">
                            <Routes>
                                <Route path="/" element={<Login />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/board" element={<Board />} />
                                <Route path="/board/:uid" element={<Board />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </Router>
        </QueryClientProvider>
    );
};

export default App;

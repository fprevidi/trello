import React from 'react';
import './App.css';
import Login from './components/Login/Login';
import LayoutWithNavbar from './components/LayoutWithNavBar';
import Home from './components/Home/Home';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';



const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const authToken = localStorage.getItem('authToken');
        return !!authToken; // Imposta isAuthenticated in base alla presenza del token
    });
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!authToken);
    }, []);


    return (
           <Router>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <LayoutWithNavbar>
                            <Home />
                        </LayoutWithNavbar>
                    </ProtectedRoute>
                } />
                    <Route path="/Login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} onLoginFailure={() => setIsAuthenticated(false)} />} />
                </Routes>
          </Router>
    );

  
}

export default App;
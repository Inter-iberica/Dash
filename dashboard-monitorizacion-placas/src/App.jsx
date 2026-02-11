import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import DeviceDetails from './components/DeviceDetails';
import Particles from './components/Particles';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Verificar si hay sesión guardada
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <Particles />
            <Routes>
                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/users"
                    element={
                        user && user.role === 'admin' ?
                            <UserManagement user={user} onLogout={handleLogout} /> :
                            <Navigate to="/dashboard" />
                    }
                />
                <Route
                    path="/device/:id"
                    element={
                        user ? <DeviceDetails user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;

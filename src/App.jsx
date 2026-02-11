import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import DeviceDetails from './components/DeviceDetails';
import TestController from './components/TestController';
import Particles from './components/Particles';

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    if (parsedUser && parsedUser.email) {
                        setUser(parsedUser);
                    }
                } catch (error) {
                    console.error('Error parsing user:', error);
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };
        checkSession();
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    if (isLoading) {
        return (
            <div className="loading-screen" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
                color: '#00D9FF'
            }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <Router>
            <Particles />
            <Routes>
                {/* Ruta de diagnóstico pública para emergencias */}
                <Route
                    path="/test"
                    element={<TestController user={user || { name: 'Invitado', role: 'guest' }} onLogout={handleLogout} />}
                />

                <Route
                    path="/login"
                    element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
                />

                <Route
                    path="/dashboard"
                    element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
                />

                <Route
                    path="/users"
                    element={user && user.role === 'admin' ?
                        <UserManagement user={user} onLogout={handleLogout} /> :
                        <Navigate to={user ? "/dashboard" : "/login"} replace />
                    }
                />

                <Route
                    path="/device/:id"
                    element={user ? <DeviceDetails user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
                />

                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import UserModal from './UserModal';
import './UserManagement.css';

function UserManagement({ user, onLogout }) {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        // Cargar usuarios desde localStorage o usar datos por defecto
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        } else {
            const defaultUsers = [
                { id: '1', name: 'Admin User', email: 'admin@demo.com', password: 'admin123', role: 'admin', status: 'active', lastLogin: new Date().toISOString() },
                { id: '2', name: 'Basic User', email: 'user@demo.com', password: 'user123', role: 'user', status: 'active', lastLogin: new Date(Date.now() - 86400000).toISOString() },
                { id: '3', name: 'John Doe', email: 'john@demo.com', password: 'john123', role: 'user', status: 'active', lastLogin: new Date(Date.now() - 172800000).toISOString() },
                { id: '4', name: 'Jane Smith', email: 'jane@demo.com', password: 'jane123', role: 'admin', status: 'inactive', lastLogin: new Date(Date.now() - 604800000).toISOString() },
            ];
            setUsers(defaultUsers);
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }, []);

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        basicUsers: users.filter(u => u.role === 'user').length
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || u.role === filter;
        return matchesSearch && matchesFilter;
    });

    const handleToggleRole = (userId) => {
        const updatedUsers = users.map(u =>
            u.id === userId
                ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' }
                : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const handleToggleStatus = (userId) => {
        const updatedUsers = users.map(u =>
            u.id === userId
                ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
                : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleSaveUser = (userData) => {
        let updatedUsers;

        if (editingUser) {
            // Actualizar usuario existente
            updatedUsers = users.map(u =>
                u.id === editingUser.id
                    ? { ...u, ...userData, lastLogin: u.lastLogin }
                    : u
            );
        } else {
            // Agregar nuevo usuario
            const newUser = {
                ...userData,
                id: `user-${Date.now()}`,
                lastLogin: new Date().toISOString()
            };
            updatedUsers = [...users, newUser];
        }

        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setShowModal(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            const updatedUsers = users.filter(u => u.id !== userId);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} currentPage="users" />

            <div className="main-content">
                <Navbar user={user} onLogout={onLogout} />

                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <div>
                            <h1>Gestión de Usuarios</h1>
                            <p>Administra roles y permisos de usuarios</p>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddUser}>
                            ➕ Agregar Usuario
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card glass-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-info">
                                <h3>{stats.total}</h3>
                                <p>Total Usuarios</p>
                            </div>
                        </div>
                        <div className="stat-card glass-card" style={{ borderLeftColor: '#8B5CF6' }}>
                            <div className="stat-icon">👑</div>
                            <div className="stat-info">
                                <h3>{stats.admins}</h3>
                                <p>Administradores</p>
                            </div>
                        </div>
                        <div className="stat-card glass-card">
                            <div className="stat-icon">👤</div>
                            <div className="stat-info">
                                <h3>{stats.basicUsers}</h3>
                                <p>Usuarios Básicos</p>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="glass-card devices-table-container">
                        <div className="table-header">
                            <h2>Lista de Usuarios</h2>
                            <div className="table-controls">
                                <select
                                    className="filter-select"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">Todos los Usuarios</option>
                                    <option value="admin">Administradores</option>
                                    <option value="user">Usuarios Básicos</option>
                                </select>
                                <div className="search-box">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar usuarios..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Último Acceso</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u.id}>
                                            <td><code>{u.id}</code></td>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                    {u.role === 'admin' ? '👑 Administrador' : '👤 Usuario'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${u.status === 'active' ? 'badge-online' : 'badge-offline'}`}>
                                                    {u.status === 'active' ? '● Activo' : '● Inactivo'}
                                                </span>
                                            </td>
                                            <td>{formatDate(u.lastLogin)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => handleEditUser(u)}
                                                        title="Editar usuario"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="action-btn view"
                                                        onClick={() => handleToggleRole(u.id)}
                                                        title="Cambiar rol"
                                                    >
                                                        🔄
                                                    </button>
                                                    <button
                                                        className="action-btn view"
                                                        onClick={() => handleToggleStatus(u.id)}
                                                        title={u.status === 'active' ? 'Desactivar' : 'Activar'}
                                                    >
                                                        {u.status === 'active' ? '🔒' : '🔓'}
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <UserModal
                    user={editingUser}
                    onSave={handleSaveUser}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default UserManagement;

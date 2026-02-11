import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ user, currentPage }) {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '/dashboard' },
        { id: 'devices', icon: '📱', label: 'Dispositivos', path: '/dashboard' },
    ];

    if (user.role === 'admin') {
        menuItems.push(
            { id: 'users', icon: '👥', label: 'Usuarios', path: '/users' },
            { id: 'settings', icon: '⚙️', label: 'Configuración', path: '/settings' }
        );
    }

    return (
        <div className="sidebar glass-card">
            <div className="sidebar-header">
                <div className="logo">
                    <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                        <circle cx="25" cy="25" r="20" stroke="url(#gradient)" strokeWidth="3" />
                        <path d="M25 15 L25 35 M15 25 L35 25" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00D9FF" />
                                <stop offset="100%" stopColor="#0A7AFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h2>DMS</h2>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-role-badge">
                    <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;

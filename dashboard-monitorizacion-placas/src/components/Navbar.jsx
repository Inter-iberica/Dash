import './Navbar.css';

function Navbar({ user, onLogout }) {
    return (
        <div className="navbar glass-card">
            <div className="navbar-title">
                <h2>Device Monitoring System</h2>
            </div>

            <div className="navbar-actions">
                <div className="user-info">
                    <div className="user-avatar">
                        {user.role === 'admin' ? '👑' : '👤'}
                    </div>
                    <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">
                            {user.role === 'admin' ? 'Administrador' : 'Usuario Básico'}
                        </span>
                    </div>
                </div>

                <button className="btn btn-secondary logout-btn" onClick={onLogout}>
                    🚪 Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default Navbar;

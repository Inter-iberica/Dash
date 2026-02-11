import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Usuarios de demostración
    const demoUsers = [
        { email: 'admin@demo.com', password: 'admin123', role: 'admin', name: 'Admin User' },
        { email: 'user@demo.com', password: 'user123', role: 'user', name: 'Basic User' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simular delay de autenticación
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar credenciales
        const user = demoUsers.find(u => u.email === email && u.password === password);

        if (user) {
            onLogin({
                email: user.email,
                name: user.name,
                role: user.role
            });
        } else {
            setError('Email o contraseña incorrectos');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card glass-card">
                <div className="login-header">
                    <div className="logo">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
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
                    <h1>Device Monitoring System</h1>
                    <p>Inicia sesión para continuar</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-icon">📧</div>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="input-icon">🔒</div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>

                    <div className="login-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Recordarme</span>
                        </label>
                        <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                        {loading ? <div className="spinner" style={{ width: '20px', height: '20px', margin: '0 auto' }} /> : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="demo-credentials">
                    <p><strong>Credenciales de demostración:</strong></p>
                    <p>👤 Admin: admin@demo.com / admin123</p>
                    <p>👤 Usuario: user@demo.com / user123</p>
                </div>
            </div>
        </div>
    );
}

export default Login;

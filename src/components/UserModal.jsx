import { useState } from 'react';

function UserModal({ user, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'user',
        status: user?.status || 'active',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que si es nuevo usuario, tenga contraseña
        if (!user && !formData.password) {
            alert('La contraseña es requerida para nuevos usuarios');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{user ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Nombre Completo</label>
                        <div className="input-icon">👤</div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Juan Pérez"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-icon">📧</div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="usuario@ejemplo.com"
                            required
                            disabled={!!user}
                            title={user ? "No se puede modificar el email de un usuario existente" : ""}
                        />
                    </div>

                    {!user && (
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input-icon">🔒</div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                minLength="6"
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="role">Rol de Usuario</label>
                        <div className="input-icon">👑</div>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="user">Usuario Básico</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="status">Estado</label>
                        <div className="input-icon">⚡</div>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {user ? 'Actualizar' : 'Crear'} Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserModal;

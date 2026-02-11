import { useState, useEffect } from 'react';

function DeviceModal({ device, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Sensor',
        location: '',
        ipAddress: '',
        status: 'online',
        description: ''
    });

    useEffect(() => {
        if (device) {
            setFormData(device);
        }
    }, [device]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{device ? 'Editar Dispositivo' : 'Agregar Nuevo Dispositivo'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Nombre del Dispositivo</label>
                        <div className="input-icon">📱</div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Sensor Principal A"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="type">Tipo de Dispositivo</label>
                        <div className="input-icon">🔧</div>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="Sensor">Sensor</option>
                            <option value="Controller">Controller</option>
                            <option value="Gateway">Gateway</option>
                            <option value="Monitor">Monitor</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="location">Ubicación</label>
                        <div className="input-icon">📍</div>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Ej: Planta 1"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="ipAddress">Dirección IP</label>
                        <div className="input-icon">🌐</div>
                        <input
                            type="text"
                            id="ipAddress"
                            name="ipAddress"
                            value={formData.ipAddress}
                            onChange={handleChange}
                            placeholder="Ej: 192.168.1.100"
                            pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                            required
                        />
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
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="description">Descripción</label>
                        <div className="input-icon">📝</div>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descripción del dispositivo..."
                            rows="3"
                            style={{ paddingLeft: '45px' }}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {device ? 'Actualizar' : 'Guardar'} Dispositivo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeviceModal;

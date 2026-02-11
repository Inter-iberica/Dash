import { useState, useEffect } from 'react';

function DeviceModal({ device, onSave, onClose }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        city: '',
        company: '',
        type: 'Placa',
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
                        <label htmlFor="id">Número de Serie (ID)</label>
                        <div className="input-icon">🔢</div>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="Ej: P3240005S3P"
                            required
                            disabled={!!device}
                            title={device ? "No se puede modificar el ID de un dispositivo existente" : ""}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="name">Nombre del Dispositivo</label>
                        <div className="input-icon">📱</div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Placa Car Flash"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="city">Ciudad</label>
                        <div className="input-icon">📍</div>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Ej: Querétaro"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="company">Empresa</label>
                        <div className="input-icon">🏢</div>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Ej: Car Flash"
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
                            <option value="Placa">Placa</option>
                            <option value="Sensor">Sensor</option>
                            <option value="Controller">Controller</option>
                            <option value="Gateway">Gateway</option>
                            <option value="Monitor">Monitor</option>
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

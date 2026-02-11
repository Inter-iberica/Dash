import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DeviceModal from './DeviceModal';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const devicesPerPage = 10;

    // Fetch devices from API
    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://sqj6a1yysl.execute-api.us-west-1.amazonaws.com/default/IWSS_GetDeviceStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'YedYxiPP3n5rbjlwb24cQag44EjobK2fa4plfnMT'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Transformar datos de la API al formato esperado
                const transformedDevices = data.map((device, index) => ({
                    id: device.id || `device-${index}`,
                    name: device.name || device.deviceName || `Device ${index + 1}`,
                    type: device.type || device.deviceType || 'Unknown',
                    status: device.status || (device.online ? 'online' : 'offline'),
                    location: device.location || 'Unknown',
                    ipAddress: device.ipAddress || device.ip || 'N/A',
                    lastUpdate: device.lastUpdate || device.timestamp || new Date().toISOString(),
                    description: device.description || '',
                    ...device
                }));
                setDevices(transformedDevices);
            } else {
                console.error('Error fetching devices:', response.statusText);
                // Usar datos de demostración si falla la API
                setDevices(getDemoDevices());
            }
        } catch (error) {
            console.error('Error fetching devices:', error);
            // Usar datos de demostración si falla la API
            setDevices(getDemoDevices());
        }
        setLoading(false);
    };

    // Datos de demostración
    const getDemoDevices = () => [
        { id: '1', name: 'Sensor Principal A', type: 'Sensor', status: 'online', location: 'Planta 1', ipAddress: '192.168.1.101', lastUpdate: new Date().toISOString(), description: 'Sensor de temperatura principal' },
        { id: '2', name: 'Gateway Central', type: 'Gateway', status: 'online', location: 'Sala de Control', ipAddress: '192.168.1.1', lastUpdate: new Date().toISOString(), description: 'Gateway principal de comunicaciones' },
        { id: '3', name: 'Monitor B-12', type: 'Monitor', status: 'offline', location: 'Planta 2', ipAddress: '192.168.1.112', lastUpdate: new Date(Date.now() - 3600000).toISOString(), description: 'Monitor de producción' },
        { id: '4', name: 'Controller X-5', type: 'Controller', status: 'online', location: 'Zona Norte', ipAddress: '192.168.1.205', lastUpdate: new Date().toISOString(), description: 'Controlador de procesos' },
        { id: '5', name: 'Sensor Backup C', type: 'Sensor', status: 'online', location: 'Planta 1', ipAddress: '192.168.1.102', lastUpdate: new Date().toISOString(), description: 'Sensor de respaldo' },
    ];

    const stats = {
        total: devices.length,
        active: devices.filter(d => d.status === 'online').length,
        offline: devices.filter(d => d.status === 'offline').length,
        alerts: devices.filter(d => d.status === 'offline' || d.alerts).length
    };

    const filteredDevices = devices.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastDevice = currentPage * devicesPerPage;
    const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
    const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);
    const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

    const handleAddDevice = () => {
        setEditingDevice(null);
        setShowModal(true);
    };

    const handleEditDevice = (device) => {
        setEditingDevice(device);
        setShowModal(true);
    };

    const handleDeleteDevice = (deviceId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) {
            setDevices(devices.filter(d => d.id !== deviceId));
        }
    };

    const handleSaveDevice = (deviceData) => {
        if (editingDevice) {
            // Actualizar dispositivo existente
            setDevices(devices.map(d => d.id === editingDevice.id ? { ...d, ...deviceData } : d));
        } else {
            // Agregar nuevo dispositivo
            const newDevice = {
                ...deviceData,
                id: `device-${Date.now()}`,
                lastUpdate: new Date().toISOString()
            };
            setDevices([...devices, newDevice]);
        }
        setShowModal(false);
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
            <Sidebar user={user} currentPage="dashboard" />

            <div className="main-content">
                <Navbar user={user} onLogout={onLogout} />

                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <div>
                            <h1>Dashboard de Monitorización</h1>
                            <p>Gestión y monitoreo de dispositivos en tiempo real</p>
                        </div>
                        {user.role === 'admin' && (
                            <button className="btn btn-primary" onClick={handleAddDevice}>
                                ➕ Agregar Dispositivo
                            </button>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card glass-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-info">
                                <h3>{stats.total}</h3>
                                <p>Total Dispositivos</p>
                            </div>
                        </div>
                        <div className="stat-card glass-card success">
                            <div className="stat-icon">✅</div>
                            <div className="stat-info">
                                <h3>{stats.active}</h3>
                                <p>Dispositivos Activos</p>
                            </div>
                        </div>
                        <div className="stat-card glass-card error">
                            <div className="stat-icon">❌</div>
                            <div className="stat-info">
                                <h3>{stats.offline}</h3>
                                <p>Dispositivos Offline</p>
                            </div>
                        </div>
                        <div className="stat-card glass-card warning">
                            <div className="stat-icon">⚠️</div>
                            <div className="stat-info">
                                <h3>{stats.alerts}</h3>
                                <p>Alertas</p>
                            </div>
                        </div>
                    </div>

                    {/* Devices Table */}
                    <div className="glass-card devices-table-container">
                        <div className="table-header">
                            <h2>Lista de Dispositivos</h2>
                            <div className="search-box">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar dispositivos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="spinner" />
                        ) : (
                            <>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Tipo</th>
                                                <th>Estado</th>
                                                <th>Ubicación</th>
                                                <th>Última Actualización</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDevices.map(device => (
                                                <tr key={device.id}>
                                                    <td><code>{device.id}</code></td>
                                                    <td><strong>{device.name}</strong></td>
                                                    <td>{device.type}</td>
                                                    <td>
                                                        <span className={`badge badge-${device.status}`}>
                                                            {device.status === 'online' ? '● Online' : '● Offline'}
                                                        </span>
                                                    </td>
                                                    <td>📍 {device.location}</td>
                                                    <td>{formatDate(device.lastUpdate)}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="action-btn view"
                                                                onClick={() => navigate(`/device/${device.id}`)}
                                                                title="Ver detalles"
                                                            >
                                                                👁️
                                                            </button>
                                                            {user.role === 'admin' && (
                                                                <>
                                                                    <button
                                                                        className="action-btn edit"
                                                                        onClick={() => handleEditDevice(device)}
                                                                        title="Editar"
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button
                                                                        className="action-btn delete"
                                                                        onClick={() => handleDeleteDevice(device.id)}
                                                                        title="Eliminar"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ← Anterior
                                        </button>
                                        <span className="page-info">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Siguiente →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <DeviceModal
                    device={editingDevice}
                    onSave={handleSaveDevice}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Dashboard;

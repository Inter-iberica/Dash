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
        // Actualizar cada 30 segundos
        const interval = setInterval(fetchDevices, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            // 1. Obtener los dispositivos que tenemos guardados (los que el administrador ha agregado)
            const savedDevices = JSON.parse(localStorage.getItem('devices') || '[]');

            // Si no hay dispositivos, usar los de ejemplo por defecto
            const devicesToFetch = savedDevices.length > 0 ? savedDevices : getDemoDevices();

            // 2. Consultar el estado de cada dispositivo INDIVIDUALMENTE como pide el usuario
            const fetchStatusPromises = devicesToFetch.map(async (device) => {
                try {
                    const response = await fetch('https://sqj6a1yysl.execute-api.us-west-1.amazonaws.com/default/IWSS_GetDeviceStatus', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': 'YedYxiPP3n5rbjlwb24cQag44EjobK2fa4plfnMT'
                        },
                        body: JSON.stringify({ DeviceId: device.id })
                    });

                    if (response.ok) {
                        const apiData = await response.json();
                        console.log(`DEBUG: API Response for ${device.id}:`, apiData);

                        let isOnline = false;

                        // 1. Verificar en la raíz del objeto
                        if (apiData.online === true || apiData.online === 'true' || apiData.online === 1 || apiData.online === '1') {
                            isOnline = true;
                        } else if (apiData.status?.toLowerCase() === 'online' || apiData.state?.toLowerCase() === 'online') {
                            isOnline = true;
                        }

                        // 2. Verificar si viene dentro de un campo 'body' (típico de AWS API Gateway)
                        if (!isOnline && apiData.body) {
                            try {
                                const body = typeof apiData.body === 'string' ? JSON.parse(apiData.body) : apiData.body;
                                if (body.online === true || body.online === 'true' || body.status?.toLowerCase() === 'online') {
                                    isOnline = true;
                                }
                            } catch (e) { }
                        }

                        // 3. Verificar si es un array y tomar el primer elemento
                        if (!isOnline && Array.isArray(apiData) && apiData.length > 0) {
                            const item = apiData[0];
                            if (item.online === true || item.online === 'true' || item.status?.toLowerCase() === 'online') {
                                isOnline = true;
                            }
                        }

                        return {
                            ...device,
                            status: isOnline ? 'online' : 'offline',
                            lastUpdate: apiData.timestamp || apiData.lastUpdate || new Date().toISOString(),
                            _apiData: apiData // Guardamos todo para inspección
                        };
                    } else {
                        console.error(`ERROR: API returned ${response.status} for ${device.id}`);
                        return { ...device, status: 'offline', lastUpdate: new Date().toISOString() };
                    }
                } catch (err) {
                    console.error(`Error al consultar dispositivo ${device.id}:`, err);
                    return { ...device, status: 'offline', lastUpdate: new Date().toISOString() };
                }
            });

            const updatedDevices = await Promise.all(fetchStatusPromises);
            setDevices(updatedDevices);

            // Guardar la lista con el último estado (opcional, pero útil)
            if (savedDevices.length === 0) {
                localStorage.setItem('devices', JSON.stringify(getDemoDevices()));
            }

        } catch (error) {
            console.error('❌ Error general al actualizar dispositivos:', error);
        }
        setLoading(false);
    };

    // Datos de demostración
    const getDemoDevices = () => [
        { id: 'P3240005S3P', name: 'Placa Car Flash', city: 'Queretaro', company: 'Car Flash', type: 'Placa', status: 'online', lastUpdate: new Date().toISOString(), description: 'Placa de monitorización' },
        { id: 'P3240279C94', name: 'Placa Ciuk', city: 'Puebla', company: 'Ciuk Puebla', type: 'Placa', status: 'online', lastUpdate: new Date().toISOString(), description: 'Placa de monitorización' },
        { id: 'P3240211YJA', name: 'Placa HOP WASH', city: 'Qro piñeiro', company: 'HOP WASH', type: 'Placa', status: 'offline', lastUpdate: new Date(Date.now() - 3600000).toISOString(), description: 'Placa de monitorización' },
        { id: 'P3240160I1M', name: 'Placa León', city: 'León', company: 'Interiberica', type: 'Placa', status: 'online', lastUpdate: new Date().toISOString(), description: 'Placa de monitorización' },
        { id: 'P3240216FVE', name: 'Placa Cancún', city: 'Cancún', company: 'EcoSplash', type: 'Placa', status: 'online', lastUpdate: new Date().toISOString(), description: 'Placa de monitorización' },
        { id: 'P3240367R8P', name: 'Placa Panamá', city: 'Panama', company: 'Panama', type: 'Placa', status: 'offline', lastUpdate: new Date().toISOString(), description: 'Placa de monitorización' },
    ];

    const stats = {
        total: devices.length,
        active: devices.filter(d => d.status === 'online').length,
        offline: devices.filter(d => d.status === 'offline').length,
        alerts: devices.filter(d => d.status === 'offline' || d.alerts).length
    };

    const filteredDevices = devices.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.id.toLowerCase().includes(searchTerm.toLowerCase())
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
        // Obtener dispositivos guardados
        const savedDevices = JSON.parse(localStorage.getItem('devices') || '[]');

        if (editingDevice) {
            // Actualizar dispositivo existente
            const updatedDevices = savedDevices.map(d =>
                d.id === editingDevice.id ? { ...d, ...deviceData } : d
            );
            localStorage.setItem('devices', JSON.stringify(updatedDevices));
            setDevices(devices.map(d => d.id === editingDevice.id ? { ...d, ...deviceData } : d));
        } else {
            // Agregar nuevo dispositivo
            const newDevice = {
                ...deviceData,
                id: deviceData.id || `P${Date.now()}`,
                status: 'offline', // Por defecto offline hasta que la API lo confirme
                lastUpdate: new Date().toISOString()
            };

            // Guardar en localStorage
            const updatedDevices = [...savedDevices, newDevice];
            localStorage.setItem('devices', JSON.stringify(updatedDevices));

            // Agregar a la lista actual
            setDevices([...devices, newDevice]);
        }

        setShowModal(false);

        // Refrescar desde la API después de 2 segundos
        setTimeout(fetchDevices, 2000);
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
                                                <th>Serial</th>
                                                <th>Nombre</th>
                                                <th>Ciudad</th>
                                                <th>Empresa</th>
                                                <th>Estado</th>
                                                <th>Última Actualización</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDevices.map(device => (
                                                <tr key={device.id}>
                                                    <td><code>{device.id}</code></td>
                                                    <td><strong>{device.name}</strong></td>
                                                    <td>📍 {device.city}</td>
                                                    <td>🏢 {device.company}</td>
                                                    <td>
                                                        <span className={`badge badge-${device.status}`}>
                                                            {device.status === 'online' ? '● Online' : '● Offline'}
                                                        </span>
                                                    </td>
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

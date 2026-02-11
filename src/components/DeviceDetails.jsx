import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './DeviceDetails.css';

function DeviceDetails({ user, onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState(null);
    const [cpuData, setCpuData] = useState([]);
    const [memoryData, setMemoryData] = useState([]);
    const [networkData, setNetworkData] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchDeviceData();

        // Generar datos de gráficos iniciales
        generateChartData();
        generateEvents();

        // Actualizar datos cada 10 segundos para la API y 3 para gráficos
        const apiInterval = setInterval(fetchDeviceData, 10000);
        const chartInterval = setInterval(generateChartData, 3000);

        return () => {
            clearInterval(apiInterval);
            clearInterval(chartInterval);
        };
    }, [id]);

    const fetchDeviceData = async () => {
        try {
            const response = await fetch('https://sqj6a1yysl.execute-api.us-west-1.amazonaws.com/default/IWSS_GetDeviceStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'YedYxiPP3n5rbjlwb24cQag44EjobK2fa4plfnMT'
                },
                body: JSON.stringify({ DeviceId: id })
            });

            if (response.ok) {
                const apiDevice = await response.json();
                console.log(`DEBUG: Details API Response for ${id}:`, apiDevice);

                // Obtener datos guardados localmente
                const savedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
                const savedDevice = savedDevices.find(d => d.id === id);

                if (apiDevice || savedDevice) {
                    let isOnline = false;

                    // 1. Verificar en la raíz
                    if (apiDevice.online === true || apiDevice.online === 'true' || apiDevice.online === 1 || apiDevice.online === '1') {
                        isOnline = true;
                    } else if (apiDevice.status?.toLowerCase() === 'online' || apiDevice.state?.toLowerCase() === 'online') {
                        isOnline = true;
                    }

                    // 2. Verificar en campo 'body'
                    if (!isOnline && apiDevice.body) {
                        try {
                            const bodyText = typeof apiDevice.body === 'string' ? JSON.parse(apiDevice.body) : apiDevice.body;
                            if (bodyText.online === true || bodyText.online === 'true' || bodyText.status?.toLowerCase() === 'online') {
                                isOnline = true;
                            }
                        } catch (e) { }
                    }

                    // 3. Verificar en array
                    if (!isOnline && Array.isArray(apiDevice) && apiDevice.length > 0) {
                        const item = apiDevice[0];
                        if (item.online === true || item.online === 'true' || item.status?.toLowerCase() === 'online') {
                            isOnline = true;
                        }
                    }

                    setDevice({
                        id: id,
                        name: savedDevice?.name || apiDevice?.name || `Placa ${id}`,
                        city: savedDevice?.city || apiDevice?.city || apiDevice?.location || 'Sin ciudad',
                        company: savedDevice?.company || apiDevice?.company || 'Sin empresa',
                        type: savedDevice?.type || apiDevice?.type || 'Placa',
                        status: isOnline ? 'online' : 'offline',
                        lastUpdate: apiDevice?.timestamp || apiDevice?.lastUpdate || new Date().toISOString(),
                        description: savedDevice?.description || apiDevice?.description || '',
                        uptime: apiDevice?.uptime || '99.9%',
                        temperature: apiDevice?.temperature || '40°C',
                        signalStrength: apiDevice?.signalStrength || 80,
                        battery: apiDevice?.battery || 100,
                        ...apiDevice
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching device details:', error);
            // Si falla la API, intentar cargar de localStorage o un mock básico
            const savedDevices = JSON.parse(localStorage.getItem('devices') || '[]');
            const savedDevice = savedDevices.find(d => d.id === id);
            if (savedDevice && !device) {
                setDevice({ ...savedDevice, uptime: 'N/A', temperature: 'N/A', signalStrength: 0, battery: 0 });
            }
        }
    };

    const generateChartData = () => {
        const now = new Date();
        const data = [];
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now - i * 3600000);
            data.push({
                time: time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                cpu: Math.floor(Math.random() * 40) + 30,
                memory: Math.floor(Math.random() * 30) + 50,
                upload: Math.floor(Math.random() * 50) + 20,
                download: Math.floor(Math.random() * 80) + 40
            });
        }
        setCpuData(data);
        setMemoryData(data);
        setNetworkData(data);
    };

    const generateEvents = () => {
        const eventTypes = [
            { type: 'info', icon: 'ℹ️', message: 'Dispositivo conectado exitosamente' },
            { type: 'success', icon: '✅', message: 'Actualización de firmware completada' },
            { type: 'warning', icon: '⚠️', message: 'Temperatura elevada detectada' },
            { type: 'info', icon: 'ℹ️', message: 'Reinicio programado ejecutado' },
            { type: 'success', icon: '✅', message: 'Calibración automática completada' },
        ];

        const generatedEvents = eventTypes.map((event, index) => ({
            ...event,
            timestamp: new Date(Date.now() - index * 3600000).toISOString()
        }));

        setEvents(generatedEvents);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!device) {
        return <div className="spinner" />;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} currentPage="devices" />

            <div className="main-content">
                <Navbar user={user} onLogout={onLogout} />

                <div className="dashboard-container">
                    <div className="device-details-header">
                        <button className="btn btn-secondary back-btn" onClick={() => navigate('/dashboard')}>
                            ← Volver
                        </button>
                        <div className="device-title">
                            <h1>{device.name}</h1>
                            <span className={`badge badge-${device.status}`}>
                                {device.status === 'online' ? '● Online' : '● Offline'}
                            </span>
                        </div>
                    </div>

                    <div className="device-details-grid">
                        {/* Left Column */}
                        <div className="device-left-column">
                            <div className="glass-card device-info-card">
                                <h2>Información del Dispositivo</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">🔢 Serial:</span>
                                        <code>{device.id}</code>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">🔧 Tipo:</span>
                                        <span>{device.type}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">📍 Ciudad:</span>
                                        <span>{device.city}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">🏢 Empresa:</span>
                                        <span>{device.company}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">🕐 Última Actualización:</span>
                                        <span>{formatDate(device.lastUpdate)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">📶 Estado:</span>
                                        <span className={`badge badge-${device.status}`}>
                                            {device.status === 'online' ? '● Online' : '● Offline'}
                                        </span>
                                    </div>
                                    <div className="info-item full-width">
                                        <span className="info-label">📝 Descripción:</span>
                                        <span>{device.description || 'Sin descripción'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* CPU Chart */}
                            <div className="glass-card chart-card">
                                <div className="chart-header">
                                    <h3>Uso de CPU</h3>
                                    <span className="current-value">{cpuData[cpuData.length - 1]?.cpu || 0}%</span>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={cpuData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis stroke="rgba(255,255,255,0.5)" />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(0, 0, 0, 0.8)',
                                                border: '1px solid rgba(0, 217, 255, 0.3)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="cpu" stroke="#00D9FF" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Memory Chart */}
                            <div className="glass-card chart-card">
                                <div className="chart-header">
                                    <h3>Uso de Memoria</h3>
                                    <span className="current-value">{memoryData[memoryData.length - 1]?.memory || 0}%</span>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={memoryData}>
                                        <defs>
                                            <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0A7AFF" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#0A7AFF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis stroke="rgba(255,255,255,0.5)" />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(0, 0, 0, 0.8)',
                                                border: '1px solid rgba(10, 122, 255, 0.3)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Area type="monotone" dataKey="memory" stroke="#0A7AFF" fillOpacity={1} fill="url(#memoryGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Network Chart */}
                            <div className="glass-card chart-card">
                                <div className="chart-header">
                                    <h3>Tráfico de Red</h3>
                                    <div className="legend">
                                        <span><span className="legend-dot upload"></span> Upload</span>
                                        <span><span className="legend-dot download"></span> Download</span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={networkData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis stroke="rgba(255,255,255,0.5)" />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(0, 0, 0, 0.8)',
                                                border: '1px solid rgba(0, 217, 255, 0.3)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="upload" stroke="#00FF88" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="download" stroke="#FFB800" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="device-right-column">
                            {/* Status Overview */}
                            <div className="glass-card status-card">
                                <h3>Estado General</h3>
                                <div className="status-items">
                                    <div className="status-item">
                                        <span className="status-label">⏱️ Uptime</span>
                                        <span className="status-value success">{device.uptime}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">🌡️ Temperatura</span>
                                        <span className="status-value warning">{device.temperature}</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">📶 Señal</span>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${device.signalStrength}%` }}></div>
                                            <span className="progress-text">{device.signalStrength}%</span>
                                        </div>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">🔋 Batería</span>
                                        <div className="progress-bar">
                                            <div className="progress-fill battery" style={{ width: `${device.battery}%` }}></div>
                                            <span className="progress-text">{device.battery}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Events */}
                            <div className="glass-card events-card">
                                <h3>Eventos Recientes</h3>
                                <div className="events-list">
                                    {events.map((event, index) => (
                                        <div key={index} className={`event-item ${event.type}`}>
                                            <span className="event-icon">{event.icon}</span>
                                            <div className="event-content">
                                                <p className="event-message">{event.message}</p>
                                                <span className="event-time">{formatDate(event.timestamp)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions (Admin only) */}
                            {user.role === 'admin' && (
                                <div className="glass-card actions-card">
                                    <h3>Acciones</h3>
                                    <div className="actions-buttons">
                                        <button className="btn btn-primary">
                                            ✏️ Editar Dispositivo
                                        </button>
                                        <button className="btn btn-secondary" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>
                                            🔄 Reiniciar
                                        </button>
                                        <button className="btn btn-danger">
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeviceDetails;

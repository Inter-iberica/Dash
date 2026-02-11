import { useState } from 'react';
import './Dashboard.css'; // Usar estilos generales
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function TestController({ user, onLogout }) {
    const [statusOutput, setStatusOutput] = useState('{ "esperando": true }');
    const [deviceId, setDeviceId] = useState('');
    const [deviceIdCont, setDeviceIdCont] = useState('');
    const [countOutput, setCountOutput] = useState('{"count": 0}');
    const [saveOutput, setSaveOutput] = useState('{"ok": false}');
    const [logs, setLogs] = useState([]);

    const log = (msg, isErr = false) => {
        const t = new Date().toLocaleString();
        setLogs(prev => [...prev, `${isErr ? "❌" : "✅"} [${t}] ${msg}`]);
    };

    // Usar fetch directo a AWS para probar (Simular /api/status del backend si no existe)
    // OJO: Si despliegas un backend propio, cambia esto a tu endpoint real
    const postJSON = async (url, body) => {
        try {
            // Si es /api/status, intentamos ir directo a AWS para probar CORS
            if (url === '/api/status' || url.includes('IWSS_GetDeviceStatus')) {
                const response = await fetch('https://sqj6a1yysl.execute-api.us-west-1.amazonaws.com/default/IWSS_GetDeviceStatus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'YedYxiPP3n5rbjlwb24cQag44EjobK2fa4plfnMT'
                    },
                    body: JSON.stringify(body)
                });
                const data = await response.json();
                return { ok: response.ok, status: response.status, data };
            }

            // Para el resto (contador, save), simulamos respuesta local ya que no hay backend real aún
            // Si tuvieras el backend en Netlify Functions, aquí llamarías a `/.netlify/functions/contador`
            await new Promise(r => setTimeout(r, 500)); // Delay simulado
            if (url.includes('contador')) {
                return { ok: true, status: 200, data: { deviceId: body.deviceId, count: Math.floor(Math.random() * 100) } };
            }
            if (url.includes('save-entry')) {
                return { ok: true, status: 200, data: { ok: true, id: body.deviceId } };
            }

            return { ok: false, status: 404, data: { error: "Endpoint no encontrado (Frontend Only Mode)" } };

        } catch (e) {
            return { ok: false, status: 500, data: { error: e.message } };
        }
    };

    const handleConsultar = async () => {
        if (!deviceId) {
            log("Ingresa un Device ID para consultar.", true);
            setStatusOutput('{"error":"Falta deviceId"}');
            return;
        }
        setStatusOutput("Consultando...");
        try {
            // Aquí enviamos el Body tal cual tu ejemplo: { DeviceId: deviceId }
            // Nota la mayúscula en 'DeviceId' si tu backend lo requiere así, o minúscula si es AWS directo
            // AWS suele requerir 'DeviceId' o 'deviceId' dependiendo de la Lambda. Probaremos ambos si falla.
            const r = await postJSON('/api/status', { DeviceId: deviceId });

            setStatusOutput(JSON.stringify(r.data, null, 2));
            if (r.ok) log(`Estado consultado (${r.status}) para ${deviceId}`);
            else log(`Fallo consulta (${r.status}) para ${deviceId}`, true);
        } catch (e) {
            setStatusOutput(`Error: ${e}`);
            log(`Excepción consultando estado: ${e}`, true);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} currentPage="test" />
            <div className="main-content">
                <Navbar user={user} onLogout={onLogout} />
                <div className="dashboard-container" style={{ padding: '20px', color: 'white' }}>
                    <h1>🔧 Panel de Diagnóstico y Pruebas</h1>

                    {/* Sección 1: Consultar Estado */}
                    <div className="glass-card" style={{ marginBottom: '20px', padding: '20px' }}>
                        <h2>1) Consultar estado del dispositivo</h2>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input
                                placeholder="Ej. P3240005S3P"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                            />
                            <button className="btn btn-primary" onClick={handleConsultar}>Consultar</button>
                        </div>
                        <p style={{ opacity: 0.7 }}>Llama a la API y muestra la respuesta raw.</p>
                        <pre style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
                            {statusOutput}
                        </pre>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Sección 2: Contador */}
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h2>2) Contador por dispositivo</h2>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    placeholder="Ej. P3240005S3P"
                                    value={deviceIdCont}
                                    onChange={(e) => setDeviceIdCont(e.target.value)}
                                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                                />
                                <button className="btn btn-secondary">Leer</button>
                                <button className="btn btn-secondary">Inc</button>
                            </div>
                            <pre style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
                                {countOutput}
                            </pre>
                            <p style={{ color: 'orange', fontSize: '0.8em' }}>⚠️ Nota: En Netlify (Frontend) no hay persistencia de archivos JSON.</p>
                        </div>

                        {/* Sección 3: Guardar Entrada */}
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h2>3) Guardar entrada</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input placeholder="ID / DeviceId" style={{ padding: '8px', borderRadius: '5px', color: 'black' }} />
                                <input placeholder="Ciudad" style={{ padding: '8px', borderRadius: '5px', color: 'black' }} />
                                <input placeholder="Empresa" style={{ padding: '8px', borderRadius: '5px', color: 'black' }} />
                                <button className="btn btn-success">Guardar Entrada</button>
                            </div>
                            <pre style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
                                {saveOutput}
                            </pre>
                        </div>
                    </div>

                    {/* Consola Personalizada */}
                    <div className="glass-card" style={{ marginTop: '20px', padding: '20px' }}>
                        <h2>Consola de Logs</h2>
                        <div style={{ background: '#000', height: '200px', overflowY: 'scroll', padding: '10px', fontFamily: 'monospace' }}>
                            {logs.map((l, i) => (
                                <div key={i}>{l}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestController;

# 🚀 Dashboard de Monitorización de Placas - AWS Integration

Dashboard futurista de monitorización de placas con integración directa a API de AWS y gestión de roles.

## ✨ Características Principales

### 🔌 Integración con API de AWS

El dashboard se conecta automáticamente a la API de AWS para obtener el estado de las placas en tiempo real:

```javascript
URL: https://sqj6a1yysl.execute-api.us-west-1.amazonaws.com/default/IWSS_GetDeviceStatus
Method: POST
Headers:
  - Content-Type: application/json
  - x-api-key: YedYxiPP3n5rbjlwb24cQag44EjobK2fa4plfnMT
```

**Características de la integración:**
- ✅ Actualización automática cada 30 segundos
- ✅ Estado online/offline basado en el campo `online` de la API
- ✅ Fallback a datos locales si la API no está disponible
- ✅ Sincronización con localStorage para datos adicionales

### 📊 Gestión de Dispositivos

#### Formato de Dispositivos

Los dispositivos se gestionan con el siguiente formato:

```javascript
{
  id: "P3240005S3P",        // Número de serie (Serial)
  name: "Placa Car Flash",   // Nombre descriptivo
  city: "Queretaro",         // Ciudad
  company: "Car Flash",      // Empresa
  type: "Placa",             // Tipo de dispositivo
  status: "online",          // Estado (online/offline)
  description: "..."         // Descripción opcional
}
```

#### Dispositivos de Ejemplo

```javascript
[
  { id: "P3240005S3P", city: "Queretaro", company: "Car Flash" },
  { id: "P3240279C94", city: "Puebla", company: "Ciuk Puebla" },
  { id: "P3240211YJA", city: "Qro piñeiro", company: "HOP WASH" },
  { id: "P3240160I1M", city: "León", company: "Interiberica" },
  { id: "P3240216FVE", city: "Cancún", company: "EcoSplash" },
  { id: "P3240367R8P", city: "Panama", company: "Panama" }
]
```

### 👥 Sistema de Roles

#### 👑 Administrador (admin@demo.com / admin123)
- ✅ Agregar nuevas placas con Serial, Ciudad y Empresa
- ✅ Editar información de placas existentes
- ✅ Eliminar placas
- ✅ Ver detalles completos con gráficos en tiempo real
- ✅ Gestionar usuarios y roles
- ✅ Acceso completo al sistema

#### 👤 Usuario Básico (user@demo.com / user123)
- ✅ Ver dashboard con todas las placas
- ✅ Ver detalles de placas con gráficos
- ✅ Buscar y filtrar placas
- ❌ No puede agregar/editar/eliminar placas
- ❌ No puede acceder a gestión de usuarios

### 🎨 Diseño Futurista

- **Glassmorphism**: Efectos de vidrio esmerilado
- **Gradientes Neon**: Cyan (#00D9FF) y Azul (#0A7AFF)
- **Animaciones**: Partículas flotantes y transiciones suaves
- **Badges Animados**: Estados con efecto de pulso
- **Tema Oscuro**: Paleta completa oscura con acentos brillantes

## 📦 Instalación

### Opción 1: Usar Command Prompt (CMD) - RECOMENDADO

```cmd
# 1. Abrir CMD como administrador
# 2. Navegar al proyecto
cd C:\Users\evazquez.INTER-IBERICA\.gemini\antigravity\scratch\dashboard-monitorizacion-placas

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor
npm run dev
```

### Opción 2: PowerShell (requiere permisos)

```powershell
# Primero habilitar scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Luego instalar y ejecutar
cd C:\Users\evazquez.INTER-IBERICA\.gemini\antigravity\scratch\dashboard-monitorizacion-placas
npm install
npm run dev
```

## 🔐 Credenciales de Acceso

### Administrador
- **Email:** admin@demo.com
- **Contraseña:** admin123

### Usuario Básico
- **Email:** user@demo.com
- **Contraseña:** user123

## 🚀 Funcionalidades

### Dashboard Principal
- **Estadísticas en Tiempo Real:**
  - Total de placas
  - Placas activas (online)
  - Placas offline
  - Alertas

- **Tabla de Placas:**
  - Serial (ID único)
  - Nombre
  - Ciudad
  - Empresa
  - Estado (Online/Offline con badge animado)
  - Última actualización
  - Acciones (Ver, Editar, Eliminar)

- **Búsqueda y Filtros:**
  - Buscar por nombre, ciudad o empresa
  - Paginación automática

### Agregar/Editar Placas (Solo Admin)

**Campos del formulario:**
1. **Número de Serie (ID)**: Ej: P3240005S3P (no editable después de crear)
2. **Nombre**: Nombre descriptivo de la placa
3. **Ciudad**: Ubicación de la placa
4. **Empresa**: Empresa propietaria
5. **Tipo**: Placa, Sensor, Controller, etc.
6. **Estado Inicial**: Online u Offline (se actualiza desde la API)
7. **Descripción**: Información adicional opcional

**Proceso:**
1. Click en "➕ Agregar Dispositivo"
2. Completar formulario
3. Guardar → Se guarda en localStorage
4. Después de 2 segundos, se sincroniza con la API

### Vista Detallada de Placa

- **Información Completa:**
  - Serial
  - Tipo
  - Ciudad
  - Empresa
  - Estado
  - Última actualización
  - Descripción

- **Gráficos en Tiempo Real:**
  - Uso de CPU (línea)
  - Uso de Memoria (área)
  - Tráfico de Red (upload/download)
  - Actualización cada 3 segundos

- **Métricas de Estado:**
  - Uptime
  - Temperatura
  - Señal
  - Batería

- **Log de Eventos:**
  - Eventos recientes con timestamps
  - Códigos de color por severidad

### Gestión de Usuarios (Solo Admin)

- Ver lista completa de usuarios
- Cambiar roles (Admin ↔ Usuario)
- Activar/Desactivar usuarios
- Eliminar usuarios
- Filtros por rol

## 🔄 Flujo de Datos

```
1. App inicia → Fetch desde API de AWS
2. API responde con array de dispositivos
3. Se busca info adicional en localStorage (city, company, name)
4. Se combinan datos de API + localStorage
5. Se muestra en tabla
6. Actualización automática cada 30 segundos

Agregar nuevo dispositivo:
1. Admin completa formulario
2. Se guarda en localStorage
3. Se agrega a la lista local
4. Después de 2 segundos → Refresh desde API
5. Si el serial existe en API → Se actualiza estado
```

## 📁 Estructura de Datos

### LocalStorage

```javascript
// Dispositivos guardados localmente
localStorage.setItem('devices', JSON.stringify([
  {
    id: "P3240005S3P",
    name: "Placa Car Flash",
    city: "Queretaro",
    company: "Car Flash",
    type: "Placa",
    description: "..."
  }
]));

// Usuario actual
localStorage.setItem('user', JSON.stringify({
  email: "admin@demo.com",
  name: "Admin User",
  role: "admin"
}));
```

### Respuesta de API (Esperada)

```javascript
[
  {
    serial: "P3240005S3P",
    online: true,
    timestamp: "2026-02-11T19:30:00Z",
    // ... otros campos de la API
  }
]
```

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **React Router 6** - Navegación
- **Recharts** - Gráficos interactivos
- **Vite** - Build tool
- **CSS Vanilla** - Estilos personalizados

## 🎯 Scripts Disponibles

```bash
npm run dev      # Desarrollo (puerto 3000)
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 📱 Responsive

Completamente adaptado para:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1024px - 1920px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (< 768px)

## 🔧 Personalización

### Cambiar colores

Edita `src/index.css`:

```css
:root {
  --neon-cyan: #00D9FF;
  --neon-blue: #0A7AFF;
  --purple-dark: #0F0C29;
  /* ... */
}
```

### Cambiar intervalo de actualización

Edita `src/components/Dashboard.jsx`:

```javascript
// Cambiar de 30000 (30 seg) a otro valor
const interval = setInterval(fetchDevices, 30000);
```

## 🌐 Navegación

- `/login` - Inicio de sesión
- `/dashboard` - Dashboard principal
- `/device/:id` - Detalles de placa
- `/users` - Gestión de usuarios (solo admin)

## ⚠️ Notas Importantes

1. **API de AWS**: El dashboard intenta conectarse a la API real. Si falla, usa datos de demostración.

2. **LocalStorage**: Los datos adicionales (city, company, name) se guardan localmente y se combinan con los datos de la API.

3. **Estado Online/Offline**: Se determina por el campo `online` de la API, no por localStorage.

4. **Sincronización**: Después de agregar/editar un dispositivo, espera 2 segundos para que se sincronice con la API.

5. **Serial (ID)**: El número de serie no se puede modificar después de crear el dispositivo.

## 📞 Soporte

Para problemas o dudas:
1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que npm funcione: `npm --version`
3. Revisa la consola del navegador (F12) para errores
4. Verifica la conexión a la API de AWS

---

**Desarrollado con ❤️ usando React, Vite y AWS**

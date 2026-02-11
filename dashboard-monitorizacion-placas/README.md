# 🚀 Dashboard de Monitorización de Placas

Dashboard futurista de monitorización de dispositivos con gestión de roles y permisos de usuario.

![Dashboard Preview](https://via.placeholder.com/800x400/0F0C29/00D9FF?text=Dashboard+Futurista)

## ✨ Características

### 🎨 Diseño Futurista
- **Glassmorphism**: Efectos de vidrio esmerilado en todas las tarjetas
- **Gradientes Neon**: Colores vibrantes cyan y azul (#00D9FF, #0A7AFF)
- **Animaciones Suaves**: Transiciones y micro-animaciones en todos los elementos
- **Fondo Animado**: Grid dinámico con partículas flotantes
- **Tema Oscuro**: Paleta de colores oscura con acentos brillantes

### 👥 Sistema de Roles
- **Administrador**: Acceso completo para agregar, editar y eliminar dispositivos y usuarios
- **Usuario Básico**: Vista de solo lectura del dashboard y dispositivos

### 📊 Funcionalidades

#### Dashboard Principal
- Estadísticas en tiempo real (Total, Activos, Offline, Alertas)
- Tabla de dispositivos con búsqueda y paginación
- Estados visuales con badges animados
- Acciones rápidas (Ver, Editar, Eliminar)

#### Gestión de Dispositivos
- Agregar nuevos dispositivos
- Editar información de dispositivos existentes
- Eliminar dispositivos (solo admin)
- Integración con API real

#### Vista Detallada de Dispositivos
- Información completa del dispositivo
- Gráficos en tiempo real:
  - Uso de CPU (línea)
  - Uso de Memoria (área)
  - Tráfico de Red (upload/download)
- Métricas de estado (Uptime, Temperatura, Señal, Batería)
- Log de eventos recientes
- Acciones de administración

#### Gestión de Usuarios (Solo Admin)
- Ver lista de usuarios
- Cambiar roles (Admin ↔ Usuario)
- Activar/Desactivar usuarios
- Eliminar usuarios
- Filtros y búsqueda

### 🔌 Integración con API

El dashboard se conecta a la API de AWS:

```javascript
URL: https://sqj6a1yysl.execute-api.us-west-1.amazonaws.com/default/IWSS_GetDeviceStatus
Method: POST
Headers:
  - Content-Type: application/json
  - x-api-key: YedYxiPP3n5rbjlwb24cQag44EjobK2fa4plfnMT
```

Si la API no está disponible, el sistema usa datos de demostración automáticamente.

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **React Router 6** - Navegación
- **Recharts** - Gráficos interactivos
- **Vite** - Build tool y dev server
- **CSS Vanilla** - Estilos personalizados

## 📦 Instalación

### Prerrequisitos
- Node.js 16+ y npm

### Pasos

1. **Navega al directorio del proyecto:**
   ```bash
   cd C:\Users\evazquez.INTER-IBERICA\.gemini\antigravity\scratch\dashboard-monitorizacion-placas
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciales de Demostración

### Administrador
- **Email:** admin@demo.com
- **Contraseña:** admin123
- **Permisos:** Acceso completo

### Usuario Básico
- **Email:** user@demo.com
- **Contraseña:** user123
- **Permisos:** Solo lectura

## 📁 Estructura del Proyecto

```
dashboard-monitorizacion-placas/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Dashboard principal
│   │   ├── Dashboard.css
│   │   ├── Login.jsx              # Pantalla de login
│   │   ├── Login.css
│   │   ├── Sidebar.jsx            # Barra lateral de navegación
│   │   ├── Sidebar.css
│   │   ├── Navbar.jsx             # Barra superior
│   │   ├── Navbar.css
│   │   ├── DeviceModal.jsx        # Modal agregar/editar dispositivo
│   │   ├── DeviceDetails.jsx      # Vista detallada de dispositivo
│   │   ├── DeviceDetails.css
│   │   ├── UserManagement.jsx     # Gestión de usuarios
│   │   ├── UserManagement.css
│   │   └── Particles.jsx          # Partículas animadas
│   ├── App.jsx                    # Componente raíz
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Funcionalidades por Rol

### 👑 Administrador
- ✅ Ver dashboard completo
- ✅ Agregar dispositivos
- ✅ Editar dispositivos
- ✅ Eliminar dispositivos
- ✅ Ver detalles de dispositivos
- ✅ Gestionar usuarios
- ✅ Cambiar roles de usuarios
- ✅ Activar/Desactivar usuarios

### 👤 Usuario Básico
- ✅ Ver dashboard (solo lectura)
- ✅ Ver lista de dispositivos
- ✅ Ver detalles de dispositivos
- ❌ No puede agregar/editar/eliminar
- ❌ No puede acceder a gestión de usuarios

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

## 🎨 Paleta de Colores

```css
--neon-cyan: #00D9FF
--neon-blue: #0A7AFF
--purple-dark: #0F0C29
--purple-mid: #302B63
--purple-light: #24243E
--success: #00FF88
--warning: #FFB800
--error: #FF3366
```

## 📱 Responsive

El dashboard es completamente responsive y se adapta a:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1024px - 1920px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (< 768px)

## 🔄 Actualizaciones en Tiempo Real

Los gráficos y métricas se actualizan automáticamente cada 3 segundos para simular monitoreo en tiempo real.

## 🌐 Navegación

- `/login` - Pantalla de inicio de sesión
- `/dashboard` - Dashboard principal
- `/device/:id` - Detalles de dispositivo
- `/users` - Gestión de usuarios (solo admin)

## 📝 Notas

- Los datos de demostración se generan automáticamente si la API no está disponible
- La sesión se guarda en localStorage
- Los gráficos usan datos simulados que se actualizan en tiempo real

## 🤝 Soporte

Para cualquier duda o problema, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ usando React y Stitch**

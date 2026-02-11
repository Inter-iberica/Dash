# INSTRUCCIONES DE INSTALACIÓN Y EJECUCIÓN

## ⚠️ Problema con PowerShell

Hay un problema con la política de ejecución de scripts en PowerShell. Aquí hay dos soluciones:

## Solución 1: Usar Command Prompt (CMD) en lugar de PowerShell

1. Abre **Command Prompt** (CMD) como administrador:
   - Presiona `Win + R`
   - Escribe `cmd`
   - Presiona `Ctrl + Shift + Enter` para ejecutar como administrador

2. Navega al directorio del proyecto:
   ```cmd
   cd C:\Users\evazquez.INTER-IBERICA\.gemini\antigravity\scratch\dashboard-monitorizacion-placas
   ```

3. Instala las dependencias:
   ```cmd
   npm install
   ```

4. Inicia el servidor de desarrollo:
   ```cmd
   npm run dev
   ```

## Solución 2: Cambiar la política de ejecución de PowerShell

1. Abre **PowerShell** como administrador:
   - Presiona `Win + X`
   - Selecciona "Windows PowerShell (Administrador)"

2. Ejecuta el siguiente comando:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Confirma con `Y` cuando se te pregunte

4. Ahora puedes usar PowerShell normalmente:
   ```powershell
   cd C:\Users\evazquez.INTER-IBERICA\.gemini\antigravity\scratch\dashboard-monitorizacion-placas
   npm install
   npm run dev
   ```

## 🚀 Pasos Rápidos (Usando CMD)

```cmd
# 1. Abrir CMD como administrador

# 2. Navegar al proyecto
cd C:\Users\evazquez.INTER-IBERICA\.gemini\antigravity\scratch\dashboard-monitorizacion-placas

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
```

## 🌐 Acceder a la Aplicación

Una vez que el servidor esté corriendo, abre tu navegador en:
```
http://localhost:3000
```

## 🔐 Credenciales de Prueba

**Administrador:**
- Email: admin@demo.com
- Contraseña: admin123

**Usuario Básico:**
- Email: user@demo.com
- Contraseña: user123

## 📦 Dependencias que se Instalarán

- react: ^18.3.1
- react-dom: ^18.3.1
- react-router-dom: ^6.22.0
- recharts: ^2.12.0
- vite: ^5.1.0
- @vitejs/plugin-react: ^4.2.1

## ✅ Verificación

Después de ejecutar `npm run dev`, deberías ver algo como:

```
  VITE v5.1.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## 🔧 Solución de Problemas

### Error: "npm no se reconoce como comando"
- Asegúrate de que Node.js esté instalado
- Verifica que Node.js esté en el PATH del sistema

### Error: "Cannot find module"
- Ejecuta `npm install` nuevamente
- Elimina la carpeta `node_modules` y ejecuta `npm install` de nuevo

### Puerto 3000 en uso
- El servidor intentará usar otro puerto automáticamente
- O puedes cambiar el puerto en `vite.config.js`

## 📞 Soporte

Si tienes problemas, verifica:
1. Node.js versión 16 o superior: `node --version`
2. npm está instalado: `npm --version`
3. Estás en el directorio correcto del proyecto

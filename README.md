# 🏨 Vesta PMS - Hassle-free Hotel Management System

**Vesta PMS** es un sistema de gestión hotelera (PMS) completo y moderno, diseñado para facilitar la administración de reservas, clientes, facturación y usuarios en hoteles de cualquier tamaño. Desarrollado con **Node.js, Express, MySQL, React y Bootstrap**, Vesta PMS ofrece una experiencia eficiente, intuitiva y segura para el personal y la administración hotelera.

---

## 🚀 Tecnologías Utilizadas

- **Backend:** Node.js, Express, MySQL, Sequelize
- **Frontend:** React, Bootstrap
- **Autenticación:** JWT, bcryptjs
- **Control de versiones:** Git & GitHub

---

## ✨ Funcionalidades Principales

✔ **Gestión de Reservas de Hotel** – Creación, edición, búsqueda y check-in/check-out de reservas.  
✔ **Base de Datos de Clientes y Empresas** – Registro y edición de clientes particulares y corporativos.  
✔ **Facturación y Gestión de Facturas** – Generación, consulta y descarga de facturas.  
✔ **Gestión de Habitaciones** – Visualización de planning, room rack, edición y bloqueo de habitaciones.  
✔ **Gestión de Usuarios y Roles** – Alta, edición, cambio de contraseña y control de acceso por roles (Administrador/Empleado).  
✔ **Historial de Reservas** – Registro de acciones y cambios sobre cada reserva.  
✔ **Interfaz Responsive y Moderna** – UI adaptada a dispositivos móviles y escritorio.  
✔ **Sistema de Precios Dinámicos** – Gestión de tarifas según demanda y eventos.  
✔ **Seguridad** – Autenticación JWT, control de roles y cifrado de contraseñas.  
✔ **Notificaciones y Feedback** – Mensajes de éxito/error y validaciones en tiempo real.

---

## 📁 Estructura del Proyecto

```
backend/
  src/
    controllers/      # Lógica de negocio y endpoints
    middlewares/      # Autenticación y control de roles
    models/           # Modelos Sequelize (ORM)
    routes/           # Definición de rutas de la API
    services/         # Servicios de negocio reutilizables
    config/           # Configuración de base de datos
    server.js         # Arranque del servidor Express
  scripts/            # Scripts para carga de datos y pruebas
frontend/
  src/
    components/       # Componentes reutilizables (Navbar, Layout, etc.)
    context/          # Contexto de autenticación
    pages/            # Páginas principales (reservas, clientes, empresas, etc.)
    routes.js         # Definición de rutas del frontend
    main.jsx          # Arranque de la app React
    App.jsx           # Componente raíz
```

---

## 🔧 Requisitos Previos

- **Node.js v20.17.0**
- **npm v10.8.2**
- **MySQL 8.0**
- **Git**

---

## 👜 Instalación y Puesta en Marcha

### 1️⃣ Clonar el repositorio
```sh
git clone https://github.com/Jrealmorillo/vesta-pms.git
cd vesta-pms
```

### 2️⃣ Backend
```sh
cd backend
npm install
```

#### 2.1 Configurar variables de entorno
Crea un archivo `.env` en `backend` con los datos de conexión:
```sh
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vesta_pms
JWT_SECRET=your_secret_key
```

#### 2.2 Crear la base de datos MySQL
```sql
CREATE DATABASE vesta_pms;
```
O ejecuta el script SQL incluido:
```sh
mysql -u root -p vesta_pms < VESTA.sql
```

#### 2.3 Iniciar el servidor backend
```sh
npm run dev  # (Requiere nodemon)
```
Si falla, prueba:
```sh
node src/server.js
```

### 3️⃣ Frontend
```sh
cd ../frontend
npm install
npm run dev
```
Accede a la app en: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Endpoints y API

### **Usuarios**
- `POST /usuarios/registro` – Registrar usuario
- `GET /usuarios` – Listar usuarios
- `GET /usuarios/:id` – Consultar usuario
- `PUT /usuarios/:id` – Editar usuario
- `PUT /usuarios/:id/cambiar-password` – Cambiar contraseña
- `DELETE /usuarios/:id` – Desactivar usuario

### **Reservas**
- `POST /reservas/registro` – Crear reserva
- `GET /reservas/id/:id` – Consultar reserva
- `PUT /reservas/:id` – Editar reserva
- `PUT /reservas/:id/cambiar-estado` – Cambiar estado (Confirmada, Anulada, Check-in)
- `GET /reservas/entrada/:fecha` – Buscar reservas por fecha de entrada
- `GET /reservas/apellido/:apellido` – Buscar reservas por apellido
- `GET /reservas/empresa/:empresa` – Buscar reservas por empresa
- `GET /reservas/:id/lineas` – Consultar líneas de reserva
- `GET /reservas/:id/historial` – Ver historial de acciones

### **Clientes y Empresas**
- `POST /clientes/registro` – Registrar cliente
- `GET /clientes` – Listar clientes
- `GET /clientes/:id` – Consultar cliente
- `PUT /clientes/:id` – Editar cliente
- `POST /empresas/registro` – Registrar empresa
- `GET /empresas` – Listar empresas
- `GET /empresas/:id` – Consultar empresa
- `PUT /empresas/:id` – Editar empresa

### **Habitaciones**
- `GET /habitaciones` – Listar habitaciones
- `PUT /habitaciones/:id` – Editar habitación

### **Facturación**
- `POST /facturas/registro` – Generar factura
- `GET /facturas/:id` – Consultar factura

---

## 🛡️ Autenticación y Seguridad

- Acceso protegido mediante JWT y control de roles (Administrador/Empleado).
- Los endpoints protegidos requieren el header:
```sh
Authorization: Bearer <tu_token>
```
- Contraseñas cifradas con bcryptjs.

---

## 🖥️ Estructura de Carpetas Destacadas

- `backend/src/controllers/` – Lógica de negocio de cada entidad.
- `backend/src/models/` – Modelos de datos y relaciones.
- `backend/src/services/` – Lógica reutilizable y operaciones complejas.
- `frontend/src/pages/` – Páginas principales de la interfaz React.
- `frontend/src/components/` – Componentes reutilizables (Navbar, Layout, etc).
- `frontend/src/context/AuthContext.jsx` – Contexto global de autenticación y usuario.

---

## 🛠️ Solución de Problemas

**1. Puerto en uso**
```sh
npx kill-port 5000
npm run dev
```
**2. Error de conexión a la base de datos**
```sh
mysql -u root -p
SHOW DATABASES;
```
**3. Variables de entorno**
Verifica que el archivo `.env` esté correctamente configurado.

---

## 📝 Comentarios y Documentación Interna

Todo el código fuente está ampliamente comentado, explicando el propósito de cada archivo, función y lógica crítica, tanto en backend como en frontend. Esto facilita la comprensión y el mantenimiento por parte de cualquier desarrollador.

---

## 📃 Licencia

© José Manuel Real Morillo, 2025. Todos los derechos reservados.

Este software es propiedad exclusiva de José Manuel Real Morillo y no puede ser copiado, modificado, distribuido ni utilizado sin permiso expreso por escrito del autor.

Para colaboraciones o licencias comerciales, contactar a: jrealmorillo@gmail.com

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas mejorar Vesta PMS, haz un fork del repositorio y envía un pull request.

---

## 📩 Contacto

Para dudas o colaboraciones, contacta a:  
📧 **jrealmorillo@gmail.com**

---


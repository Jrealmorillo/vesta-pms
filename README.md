# 🏨 Vesta PMS - Sistema de Gestión Hotelera sin complicaciones

**Vesta PMS** es un sistema de gestión hotelera (PMS) completo y moderno, diseñado para facilitar la administración de reservas, clientes, facturación, habitaciones, informes y usuarios en hoteles de cualquier tamaño. Desarrollado con **Node.js, Express, MySQL, React y Bootstrap**, Vesta PMS ofrece una experiencia eficiente, intuitiva y segura para el personal y la administración hotelera.

---

## 🚀 Tecnologías Utilizadas

- **Backend:** Node.js, Express, MySQL, Sequelize
- **Frontend:** React, Bootstrap
- **Autenticación:** JWT, bcryptjs
- **Control de versiones:** Git & GitHub

---

## ✨ Funcionalidades Principales

✔ **Gestión de Reservas de Hotel** – Creación, edición, búsqueda, check-in/check-out y control de estado de reservas.  
✔ **Base de Datos de Clientes y Empresas** – Registro y edición de clientes particulares y corporativos.  
✔ **Facturación y Gestión de Facturas** – Generación, consulta y descarga de facturas.  
✔ **Gestión de Habitaciones** – Visualización de planning, room rack, edición, bloqueo y control de ocupación/limpieza de habitaciones.  
✔ **Gestión de Usuarios y Roles** – Alta, edición, cambio de contraseña y control de acceso por roles (Administrador/Empleado).  
✔ **Historial de Reservas** – Registro de acciones y cambios sobre cada reserva.  
✔ **Informes Personalizados** – Ocupación, facturación, cargos pendientes, estado de habitaciones, clientes alojados, llegadas, salidas, resumen diario y consumo por forma de pago.  
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
    pages/            # Páginas principales (reservas, clientes, empresas, informes, etc.)
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
- `PUT /reservas/:id/cambiar-estado` – Cambiar estado (Confirmada, Anulada, Check-in, Check-out)
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

### **Informes**
- `GET /informes/ocupacion` – Informe de ocupación entre fechas
- `GET /informes/facturacion` – Facturación diaria
- `GET /informes/facturacion/rango` – Facturación entre fechas
- `GET /informes/cargos-pendientes` – Cargos pendientes por habitación
- `GET /informes/estado-habitaciones` – Estado actual de habitaciones
- `GET /informes/clientes-alojados` – Clientes alojados actualmente
- `GET /informes/llegadas` – Listado de llegadas por fecha
- `GET /informes/salidas` – Listado de salidas por fecha
- `GET /informes/resumen-dia` – Resumen de actividad diaria
- `GET /informes/consumo-forma-pago` – Consumo por forma de pago

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


# 🏨 Vesta PMS - Hassle-free Hotel Management System (English)

**Vesta PMS** is a complete and modern Property Management System (PMS) designed to simplify the management of reservations, clients, billing, rooms, reports, and users for hotels of any size. Built with **Node.js, Express, MySQL, React, and Bootstrap**, Vesta PMS provides an efficient, intuitive, and secure experience for hotel staff and management.

---

## 🚀 Technologies Used

- **Backend:** Node.js, Express, MySQL, Sequelize
- **Frontend:** React, Bootstrap
- **Authentication:** JWT, bcryptjs
- **Version control:** Git & GitHub

---

## ✨ Main Features

✔ **Hotel Reservation Management** – Create, edit, search, check-in/check-out, and control reservation status.  
✔ **Clients and Companies Database** – Register and edit individual and corporate clients.  
✔ **Billing and Invoice Management** – Generate, view, and download invoices.  
✔ **Room Management** – Planning view, room rack, edit, block, and control room occupancy/cleaning.  
✔ **User and Role Management** – Register, edit, change password, and access control by role (Admin/Employee).  
✔ **Reservation History** – Log of actions and changes for each reservation.  
✔ **Custom Reports** – Occupancy, billing, pending charges, room status, current guests, arrivals, departures, daily summary, and payment method consumption.  
✔ **Responsive and Modern UI** – Mobile and desktop friendly.  
✔ **Dynamic Pricing System** – Manage rates based on demand and events.  
✔ **Security** – JWT authentication, role control, and password encryption.  
✔ **Notifications and Feedback** – Real-time success/error messages and validations.

---

## 📁 Project Structure

```
backend/
  src/
    controllers/      # Business logic and endpoints
    middlewares/      # Authentication and role control
    models/           # Sequelize models (ORM)
    routes/           # API route definitions
    services/         # Reusable business services
    config/           # Database configuration
    server.js         # Express server entry point
  scripts/            # Data loading and test scripts
frontend/
  src/
    components/       # Reusable components (Navbar, Layout, etc.)
    context/          # Authentication context
    pages/            # Main pages (reservations, clients, companies, reports, etc.)
    routes.js         # Frontend route definitions
    main.jsx          # React app entry point
    App.jsx           # Root component
```

---

## 🔧 Prerequisites

- **Node.js v20.17.0**
- **npm v10.8.2**
- **MySQL 8.0**
- **Git**

---

## 👜 Installation & Getting Started

### 1️⃣ Clone the repository
```sh
git clone https://github.com/Jrealmorillo/vesta-pms.git
cd vesta-pms
```

### 2️⃣ Backend
```sh
cd backend
npm install
```

#### 2.1 Configure environment variables
Create a `.env` file in `backend` with your connection data:
```sh
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vesta_pms
JWT_SECRET=your_secret_key
```

#### 2.2 Create the MySQL database
```sql
CREATE DATABASE vesta_pms;
```
Or run the included SQL script:
```sh
mysql -u root -p vesta_pms < VESTA.sql
```

#### 2.3 Start the backend server
```sh
npm run dev  # (Requires nodemon)
```
If it fails, try:
```sh
node src/server.js
```

### 3️⃣ Frontend
```sh
cd ../frontend
npm install
npm run dev
```
Access the app at: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Endpoints & API

### **Users**
- `POST /usuarios/registro` – Register user
- `GET /usuarios` – List users
- `GET /usuarios/:id` – Get user
- `PUT /usuarios/:id` – Edit user
- `PUT /usuarios/:id/cambiar-password` – Change password
- `DELETE /usuarios/:id` – Deactivate user

### **Reservations**
- `POST /reservas/registro` – Create reservation
- `GET /reservas/id/:id` – Get reservation
- `PUT /reservas/:id` – Edit reservation
- `PUT /reservas/:id/cambiar-estado` – Change status (Confirmed, Cancelled, Check-in, Check-out)
- `GET /reservas/entrada/:fecha` – Search reservations by entry date
- `GET /reservas/apellido/:apellido` – Search reservations by last name
- `GET /reservas/empresa/:empresa` – Search reservations by company
- `GET /reservas/:id/lineas` – Get reservation lines
- `GET /reservas/:id/historial` – View reservation history

### **Clients & Companies**
- `POST /clientes/registro` – Register client
- `GET /clientes` – List clients
- `GET /clientes/:id` – Get client
- `PUT /clientes/:id` – Edit client
- `POST /empresas/registro` – Register company
- `GET /empresas` – List companies
- `GET /empresas/:id` – Get company
- `PUT /empresas/:id` – Edit company

### **Rooms**
- `GET /habitaciones` – List rooms
- `PUT /habitaciones/:id` – Edit room

### **Billing**
- `POST /facturas/registro` – Generate invoice
- `GET /facturas/:id` – Get invoice

### **Reports**
- `GET /informes/ocupacion` – Occupancy report (date range)
- `GET /informes/facturacion` – Daily billing
- `GET /informes/facturacion/rango` – Billing between dates
- `GET /informes/cargos-pendientes` – Pending charges by room
- `GET /informes/estado-habitaciones` – Current room status
- `GET /informes/clientes-alojados` – Currently hosted clients
- `GET /informes/llegadas` – Arrivals by date
- `GET /informes/salidas` – Departures by date
- `GET /informes/resumen-dia` – Daily activity summary
- `GET /informes/consumo-forma-pago` – Consumption by payment method

---

## 🛡️ Authentication & Security

- Protected access via JWT and role control (Admin/Employee).
- Protected endpoints require the header:
```sh
Authorization: Bearer <your_token>
```
- Passwords encrypted with bcryptjs.

---

## 🖥️ Key Folder Structure

- `backend/src/controllers/` – Business logic for each entity.
- `backend/src/models/` – Data models and relationships.
- `backend/src/services/` – Reusable logic and complex operations.
- `frontend/src/pages/` – Main React interface pages.
- `frontend/src/components/` – Reusable components (Navbar, Layout, etc).
- `frontend/src/context/AuthContext.jsx` – Global authentication and user context.

---

## 🛠️ Troubleshooting

**1. Port in use**
```sh
npx kill-port 5000
npm run dev
```
**2. Database connection error**
```sh
mysql -u root -p
SHOW DATABASES;
```
**3. Environment variables**
Check that your `.env` file is correctly configured.

---

## 📝 Comments & Internal Documentation

All source code is thoroughly commented, explaining the purpose of each file, function, and critical logic, both in backend and frontend. This makes it easy for any developer to understand and maintain.

---

## 📃 License

© José Manuel Real Morillo, 2025. All rights reserved.

This software is the exclusive property of José Manuel Real Morillo and may not be copied, modified, distributed, or used without the express written permission of the author.

For collaborations or commercial licenses, contact: jrealmorillo@gmail.com

---

## 🤝 Contributing

Contributions are welcome! If you want to improve Vesta PMS, fork the repository and submit a pull request.

---

## 📩 Contact

For questions or collaborations, contact:  
📧 **jrealmorillo@gmail.com**

---


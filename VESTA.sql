DROP DATABASE IF EXISTS VESTA_PMS;
CREATE DATABASE IF NOT EXISTS VESTA_PMS;
USE VESTA_PMS;

-- Crear la tabla de Roles para mayor flexibilidad en permisos
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar roles por defecto
INSERT INTO Roles (nombre) VALUES ('Administrador'), ('Empleado');

-- Crear la tabla Usuarios con las mejoras aplicadas
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_rol INT NOT NULL DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);


CREATE TABLE Clientes (
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento ENUM ('DNI', 'Pasaporte', 'Documento de Identidad', 'Permiso de Residencia') NOT NULL,
    numero_documento VARCHAR(30) NOT NULL UNIQUE,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(30),
    telefono VARCHAR(30),
    email VARCHAR(255),
    observaciones TEXT
);

CREATE TABLE Empresas (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cif VARCHAR(50) NOT NULL UNIQUE,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    telefono VARCHAR(30),
    email VARCHAR(255),
    credito BOOLEAN NOT NULL DEFAULT FALSE,
    observaciones TEXT
);

CREATE TABLE Habitaciones (
    numero_habitacion VARCHAR(20) PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    capacidad_minima INT NOT NULL CHECK (capacidad_minima > 0),
    capacidad_maxima INT NOT NULL CHECK (capacidad_maxima > 0),
    notas TEXT,
    precio_oficial DECIMAL(10,2) NOT NULL
);


CREATE TABLE Reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    nombre_huesped VARCHAR(150) NOT NULL,
    id_cliente INT,
    id_empresa INT,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    numero_habitacion VARCHAR(20) NULL,
    precio_total DECIMAL(10,2) DEFAULT 0 NOT NULL,
    observaciones TEXT,
    estado ENUM('Confirmada', 'Anulada', 'Check-in', 'Check-out') NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa)
);

CREATE TABLE Lineas_Reserva (
    id_linea_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    tipo_habitacion VARCHAR(50) NOT NULL,
    cantidad_habitaciones INT NOT NULL CHECK (cantidad_habitaciones > 0),
    fecha DATE NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    regimen ENUM('Solo Alojamiento', 'Alojamiento y Desayuno', 'Media Pensión', 'Pensión Completa', 'Todo Incluido') NOT NULL,
    cantidad_adultos INT NOT NULL CHECK (cantidad_adultos >= 0),
    cantidad_ninos INT NOT NULL CHECK (cantidad_ninos >= 0),
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_reserva) REFERENCES Reservas(id_reserva)
);

CREATE TABLE Historial_Reserva (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    id_usuario INT NOT NULL,
    accion ENUM('Creación', 'Anulación', 'Recuperación', 'Modificación') NOT NULL,
    fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    detalles TEXT,
    FOREIGN KEY (id_reserva) REFERENCES Reservas(id_reserva),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Facturas (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    nombre_huésped VARCHAR(150),
    id_cliente INT,
    id_empresa INT,
    id_reserva INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_emisión DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) DEFAULT 0 NOT NULL,
    forma_pago ENUM('Efectivo', 'Transferencia', 'Visa', 'Amex', 'Crédito') NOT NULL,
    estado ENUM('Pendiente', 'Pagada', 'Anulada') NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
	FOREIGN KEY (id_reserva) REFERENCES Reservas(id_reserva)
);

CREATE TABLE Detalle_Factura (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    id_factura INT,
    id_habitacion VARCHAR(20),
    id_cliente INT,
    concepto VARCHAR(255) NOT NULL,
    cantidad INT CHECK (cantidad > 0) NOT NULL,
    precio_unitario DECIMAL(10,2) DEFAULT 0 NOT NULL,
    total DECIMAL(10,2) DEFAULT 0 NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_factura) REFERENCES Facturas(id_factura) ON DELETE CASCADE,
    FOREIGN KEY (id_reserva) REFERENCES Reservas(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_habitacion) REFERENCES Habitaciones(numero_habitacion),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);









const fs = require('fs');
const path = require('path');

// Habitaciones válidas
const habitaciones = [
    "101", "102", "103", "104", "105", "106",
    "201", "202", "203", "204", "205", "206",
    "301", "302", "303", "304", "305", "306",
    "401", "402", "403", "404", "405", "406"
];

// Observaciones realistas
const observaciones = [
    "Planta alta", "Planta baja", "Habitación exterior", "No fumador", "Cliente VIP", "Cuna solicitada", "Vistas bonitas", "Acceso PMR", "Check-in tardío", "Check-out tardío", "Alérgico a frutos secos", "Viaja con mascota", "Preferencia cama doble", "Desayuno incluido", "Parking reservado", "Habitación tranquila", "Viaje de negocios", "Viaje familiar", "Solicita almohada extra", "Habitación cerca del ascensor", "Toallas extra", "Late check-out", "Early check-in", "Celebración aniversario", "Solicita habitación tranquila", " "
];

// Nombres y apellidos de ejemplo
const nombres = ["Juan", "Cristina", "José", "María", "Pedro", "Lucía", "Carlos", "Ana", "Álvaro", "Luis", "Elena", "Miguel", "Carmen", "Javier", "Laura", "Antonio", "Sara", "David", "Paula", "Manuel", "Marta", "Francisco", "Sofía"];
const apellidos = ["García", "Robles", "Vega", "Martínez", "López", "Sánchez", "Pérez", "Gómez", "Fernández", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez"];

const reservas = [];
const fechaInicio = new Date("2025-06-10");
const diasRango = 90; // 3 meses de dispersión
const habitacionesPorDia = 24;
let contador = 0;

for (let i = 0; i < 1500; i++) {
    // Alternar estado
    const estado = i % 2 === 0 ? "Confirmada" : "Anulada";
    // Nombre y apellidos aleatorios
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
    const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];
    // Observación realista
    const obs = observaciones[Math.floor(Math.random() * observaciones.length)];
    // Reparto de fechas y habitaciones
    const diasOffset = Math.floor(i / habitacionesPorDia);
    const fechaEntrada = new Date(fechaInicio);
    fechaEntrada.setDate(fechaInicio.getDate() + (diasOffset % diasRango));
    // Estancias de 1 a 5 noches
    const noches = 1 + Math.floor(Math.random() * 5);
    const fechaSalida = new Date(fechaEntrada);
    fechaSalida.setDate(fechaEntrada.getDate() + noches);
    // Asignar habitación a ~60% de reservas
    let numero_habitacion = null;
    if (Math.random() < 0.6) {
        numero_habitacion = habitaciones[Math.floor(Math.random() * habitaciones.length)];
    }
    // Precio aleatorio
    const precio_total = (60 + Math.random() * 1000).toFixed(2);
    reservas.push({
        nombre_huesped: nombre,
        primer_apellido_huesped: apellido1,
        segundo_apellido_huesped: apellido2,
        fecha_entrada: fechaEntrada.toISOString().slice(0, 10),
        fecha_salida: fechaSalida.toISOString().slice(0, 10),
        numero_habitacion,
        precio_total: parseFloat(precio_total),
        estado,
        observaciones: obs,
        id_cliente: null,
        id_empresa: null
    });
}

fs.writeFileSync(path.join(__dirname, 'reservas.json'), JSON.stringify(reservas, null, 2), 'utf-8');
console.log('Archivo reservas.json generado con 1500 reservas.');

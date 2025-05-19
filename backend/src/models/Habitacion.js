// Modelo Sequelize para la entidad Habitacion.
// Define la estructura de la tabla 'Habitaciones' y las restricciones de cada campo.

const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Habitacion = sequelize.define("Habitacion", {
    // Número de habitación (clave primaria, puede ser string para flexibilidad)
    numero_habitacion: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    // Tipo de habitación (solo valores permitidos)
    tipo: {
        type: DataTypes.ENUM("Individual", "Doble", "Triple", "Suite"),
        allowNull: false
    },
    // Capacidad máxima de personas permitidas
    capacidad_maxima: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate: {
            min: 1
        }
    },
    // Capacidad mínima de personas permitidas
    capacidad_minima: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate: {
            min: 1
        }
    },
    // Notas adicionales sobre la habitación (opcional)
    notas: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Precio oficial de la habitación (obligatorio)
    precio_oficial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
},
    {
        tableName: "Habitaciones",
        timestamps: false
});

// Exporta el modelo para su uso en otros módulos
module.exports = Habitacion;
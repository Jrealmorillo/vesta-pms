const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Habitacion = sequelize.define("Habitacion", {
    numero_habitacion: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    tipo: {
        type: DataTypes.ENUM("Individual", "Doble", "Triple", "Suite"),
        allowNull: false
    },
    capacidad_maxima: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate: {
            min: 1
        }
    },
    capacidad_minima: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate: {
            min: 1
        }
    },
    notas: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    precio_oficial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
},
    {
        tableName: "Habitaciones",
        timestamps: false
});

module.exports = Habitacion;
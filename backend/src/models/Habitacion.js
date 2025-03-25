const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Habitacion = sequelize.define("Habitacion", {
    numero_habitacion: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    tipo: {
        type: DataTypes.STRING(50),
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
        allowNull: TextTrackCue
    },
    precio_oficial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
},
    {
        tablename: "Habitaciones",
        timestamps: false
});

module.exports = Habitacion;
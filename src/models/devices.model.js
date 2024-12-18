import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";
import Type from "./types.model.js";


const Device = sequelize.define('device', {
    device_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'types',
            key: 'type_id'
        }
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
}, {
    tableName: 'devices',
    timestamps: false
});

Device.belongsTo(Type, { foreignKey: 'type_id' });

export default Device;
import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";
import Model from "./models.model.js";
import Device from "./devices.model.js";

const Filter = sequelize.define("filter", {
    filter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    conditions: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false,
    },
    model_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'filters',
    timestamps: false,
    indexes: [
        {
            name: "filter_device_index",
            fields: ["device_id"]
        }
    ]
});


Model.hasMany(Filter, { foreignKey: "model_id" });
Filter.belongsTo(Model, { foreignKey: "model_id" });
Device.hasMany(Filter, { foreignKey: "device_id" });
Filter.belongsTo(Device, { foreignKey: "device_id" });

export default Filter;

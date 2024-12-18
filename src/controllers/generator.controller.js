import fs from 'fs';
import path from 'path';
import pool from '../db/db.js';

// Generar el SQL para la tabla
const genSQLModel = (name, fields) => {
    const sqlFields = fields.map(field => {
        let fieldType;
        switch (field.type) {
            case 'String':
                fieldType = 'VARCHAR(255)';
                break;
            case 'Number':
                fieldType = 'INTEGER';
                break;
            case 'Float':
                fieldType = 'FLOAT';
                break;
            case 'Boolean':
                fieldType = 'BOOLEAN';
                break;
            case 'Date':
                fieldType = 'TIMESTAMP';
                break;
            case 'Text':
                fieldType = 'TEXT';
                break;
            case 'UUID':
                fieldType = 'UUID';
                break;
            case 'JSON':
                fieldType = 'JSON';
                break;
            default:
                fieldType = 'TEXT';
        }

        // Manejar campos con referencia
        if (field.ref) {
            return `${field.name} INTEGER REFERENCES ${field.ref}(${field.refColumn || `${field.ref}_id`})${field.required ? ' NOT NULL' : ''}`;
        }

        return `${field.name} ${fieldType}${field.required ? ' NOT NULL' : ''}`;
    });

    const sqlStr = `
CREATE TABLE IF NOT EXISTS ${name} (
    ${name}_id SERIAL PRIMARY KEY,
    ${sqlFields.join(',\n    ')},
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

    return sqlStr;
};

// Generar el modelo en JavaScript
const genJSModel = (name, fields) => {
    const jsFields = fields.map(field => {
        let fieldType;

        switch (field.type) {
            case 'String':
                fieldType = 'Sequelize.STRING';
                break;
            case 'Number':
                fieldType = 'Sequelize.INTEGER';
                break;
            case 'Float':
                fieldType = 'Sequelize.FLOAT';
                break;
            case 'Boolean':
                fieldType = 'Sequelize.BOOLEAN';
                break;
            case 'Date':
                fieldType = 'Sequelize.DATE';
                break;
            case 'Text':
                fieldType = 'Sequelize.TEXT';
                break;
            case 'UUID':
                fieldType = 'Sequelize.UUID';
                break;
            case 'JSON':
                fieldType = 'Sequelize.JSON';
                break;
            case 'Array':
                fieldType = 'Sequelize.ARRAY(Sequelize.TEXT)';
                break;
            default:
                fieldType = 'Sequelize.TEXT';
        }

        return `${field.name}: { type: ${fieldType}${field.required ? ', allowNull: false' : ''}${field.ref ? `, references: { model: '${field.ref}', key: '${field.refColumn || `${field.ref}_id`}' }` : ''} }`;
    });

    return `
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Ajusta la ruta a tu configuración de Sequelize

const ${name} = sequelize.define('${name}', {
    ${jsFields.join(',\n    ')}
}, {
    timestamps: true,
    tableName: '${name}',
});

module.exports = ${name};
`;
};

// Crear la tabla y el modelo
const createDataModel = async (name, fields) => {
    const sqlModel = genSQLModel(name, fields);
    const jsModel = genJSModel(name, fields);

    // Crear la tabla en la base de datos
    try {
        await pool.query(sqlModel);
        console.log(`Tabla ${name} creada exitosamente`);
    } catch (error) {
        console.error('Error al crear la tabla:', error);
    }

    // Guardar el modelo en un archivo JavaScript
    const dirPath = path.join(__dirname, '../models/data');
    const filePath = path.join(dirPath, `${name}.js`);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, jsModel, 'utf8');
    console.log(`Modelo ${name} generado exitosamente`);
};

// Controlador final
const finalController = async (req, res) => {
    const { name, fields } = req.body;
    try {
        await createDataModel(name, fields);
        res.json({ message: 'Modelo y tabla creados exitosamente' });
    } catch (error) {
        console.error('Error al crear el modelo y la tabla:', error);
        res.status(500).json({ message: 'Error al crear el modelo y la tabla' });
    }
};

export default finalController;

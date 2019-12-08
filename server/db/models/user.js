const { STRING, UUID, UUIDV4 } = require('sequelize');
const db = require('../connection');

const User = db.define('user', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    userName: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    password: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
})

module.exports = User
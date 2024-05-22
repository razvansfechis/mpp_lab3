import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Owner = sequelize.define('Owner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Owner;
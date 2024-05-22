import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Owner from './owner.js';

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.UUID,
    references: {
      model: Owner,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

Car.belongsTo(Owner, { foreignKey: 'ownerId' });
Owner.hasMany(Car, { foreignKey: 'ownerId' });

export default Car;
import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/sequelize';

export const Board = sequelize.define('Board', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
});
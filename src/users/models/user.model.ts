import { DataTypes, Model } from "sequelize";
import { IUser } from "../interfaces/user.interface";
import { sequelize } from "../../configs/sequelize";
import { Board } from "../../boards/models/board.model";

export const User = sequelize.define<IUser>('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

interface IBoard extends Model {
  id: number;
  name: string;
  createdBy: number;
}

User.hasMany(Board, { foreignKey: 'createdBy' });

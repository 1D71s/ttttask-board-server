import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/sequelize';
import { TaskStatus } from './enums/task-status.enum';
import { ITaskAttributes, ITaskInstance } from '../interfaces/task.interface';

export const Task = sequelize.define<ITaskInstance, ITaskAttributes>('Task', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  status: {
    type: DataTypes.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.TO_DO,
  },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
  boardId: { type: DataTypes.INTEGER, allowNull: false },
});

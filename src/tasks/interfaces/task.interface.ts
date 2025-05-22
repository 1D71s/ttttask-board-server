import { Model, Optional } from 'sequelize';
import { TaskStatus } from '../models/enums/task-status.enum';

export interface ITaskAttributes {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdBy: number;
  boardId: number;
}

export interface ITaskCreationAttributes extends Optional<ITaskAttributes, 'id' | 'status'> {}

export interface ITaskInstance extends Model<ITaskAttributes, ITaskCreationAttributes>, ITaskAttributes {}

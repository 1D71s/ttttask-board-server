import { Model } from "sequelize";

export interface IBoard extends Model {
  id: number;
  name: string;
  createdBy: number;
}
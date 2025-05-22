import { HasManyCreateAssociationMixin, Model } from "sequelize";
import { IBoard } from "../../boards/interfaces/board.interface";

export interface IUser extends Model {
  id: number;
  username: string;
  password: string;
  createBoard: HasManyCreateAssociationMixin<IBoard>;
}
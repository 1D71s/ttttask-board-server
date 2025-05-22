import { Board } from "../boards/models/board.model";
import { Task } from "../tasks/models/task.model";
import { User } from "../users/models/user.model";

Board.belongsTo(User, { foreignKey: 'createdBy' });
Board.hasMany(Task, { foreignKey: 'boardId' });

Task.belongsTo(Board, { foreignKey: 'boardId' });

export { Board, Task, User };
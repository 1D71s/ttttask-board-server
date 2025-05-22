import { Response } from 'express';
import { Task } from '../../database/relations';
import { TaskStatus } from '../models/enums/task-status.enum';
import { AuthenticatedRequest } from '../../auth/interfaces/auth-request.interface';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, boardId, description } = req.body;
    const userId = req.user?.id; 

    if (!userId) {
       res.status(401).send({message: 'Unauthorized'});
       return
    }

    const task = await Task.create({ title, boardId, description, createdBy: userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).send({message: 'Failed to create task'});
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).send({message: 'Unauthorized'});
       return
    }

    const status = req.query.status as string | undefined;

    if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
      res.status(400).send({message: `Invalid status. Allowed: ${Object.values(TaskStatus).join(', ')}`});
      return;
    }

    const whereClause: any = { createdBy: userId };
    if (status) {
      whereClause.status = status;
    }

    const tasks = await Task.findAll({ where: whereClause });
    res.json(tasks);
  } catch (error) {
    res.status(500).send({message: 'Failed to get tasks'});
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).send({message: 'Unauthorized'});
        return
    }

    const task = await Task.findOne({ where: { id, createdBy: userId } });

    if (!task) {
        res.status(404).send({message: 'Task not found'});
        return
    }

    if (task.createdBy !== userId) {
        res.status(403).send({message: 'Forbidden'});
        return
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).send({message: 'Failed to update task'});
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).send({message: 'Unauthorized'});
       return
    }

    const task = await Task.findOne({ where: { id, createdBy: userId } });
    if (!task) {
         res.status(404).send({message: 'Task not found'});
         return
    }

    if (task.createdBy !== userId) {
        res.status(403).send({message: 'Forbidden'});
        return
    }

    await task.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({message: 'Failed to delete task'});
  }
};

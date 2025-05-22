import { Response } from 'express';
import { AuthenticatedRequest } from '../../auth/interfaces/auth-request.interface';
import { Board, Task, User } from '../../database/relations';

export const createBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name } = req.body;
  const userId = req.user?.id;

  if (!name) {
    res.status(400).send({ message: 'Name is required' });
    return;
  }

  if (!userId) {
    res.status(401).send({ message: 'Unauthorized: user ID missing' });
    return;
  }

  try {
    const user = await User.findOne({ where: { id: +userId } });
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    const board = await user.createBoard({ name });
    
    res.status(201).json(board);
  } catch (err) {
    console.error('Create board error:', err);
    res.status(500).send({ message: 'Failed to create board' });
  }
};


export const getBoards = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(403).send({message: 'User is not authenticated'});
        return
    }

    try {
        const boards = await Board.findAll({ 
            where: { createdBy: userId },
            include: [
            {
                model: Task,
                as: 'Tasks',
            },
        ],
        });
        res.json(boards);
    } catch (err) {
        res.status(500).send({message: 'Failed to fetch boards'});
    }
}

export const getOneById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(403).send({message: 'User is not authenticated'});
        return
    }
    
    try {
        const board = await Board.findOne({ where: { id, createdBy: userId } });

        if (!board) {
            res.status(404).send({message: 'Board not found'});
            return;
        }
        res.json(board);
    } catch (err) {
        res.status(500).send({message: 'Failed to fetch board'});
    }
}

export const deleteBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const board = await Board.findOne({ where: { id, createdBy: userId } });
        if (!board) {
            res.status(404).send({message: 'Board not found'});
            return
        }
        await board.destroy();
        res.send({message: 'Board deleted successfully'});
    } catch (err) {
        res.status(500).send({message: 'Failed to delete board'});
    }
}

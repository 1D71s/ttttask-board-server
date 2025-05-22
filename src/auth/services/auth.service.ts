import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SECRET_KEY } from '../variables';
import jwt from 'jsonwebtoken';
import { User } from '../../database/relations';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).send({message: 'Username and password are required'});
            return;
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            res.status(400).send({message: 'User already exists'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.status(201).send({message: 'User registered successfully'});
    } catch (err) {
        res.status(400).send({message: 'Something went wrong'});
    }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({message: 'Username and password are required'});
    return;
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(400).send({message: 'Invalid credentials'});
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(400).send({message: 'Invalid credentials'});
      return;
    }

    if (!SECRET_KEY) {
      res.status(500).send({message: 'Internal Server Error'});
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send({message: 'Internal server error'});
  }
};

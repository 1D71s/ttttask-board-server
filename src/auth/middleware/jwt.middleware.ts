import express from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces/auth-request.interface';
import { SECRET_KEY } from '../variables';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.status(401).send({message: 'Access Denied'});
        return;
    }

    if (!SECRET_KEY) {
        console.log('SECRET_KEY is not defined in');
        res.status(500).send({message: 'Internal Server Error'});
        return
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.status(403).send({message: 'Invalid Token'});
            return;
        }
        req.user = user as { id: number; username: string };
        next();
    });
};
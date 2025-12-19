
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { type UserRole } from '../models/userModel.js';


export interface JwtPayload {
    userId: string;
    role: UserRole; 
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; 
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction): Response | void => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided in header.' });
    }

    try {
        
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;
        
        req.user = decoded; 
        
        next();
    } catch (error) {
        
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default auth;
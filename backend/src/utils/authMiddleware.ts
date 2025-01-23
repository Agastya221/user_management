import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload; 
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const accessToken =
        req.cookies?.accessToken 

    if (!accessToken) {
        console.log(accessToken);
        console.log('Access token is undefined or missing');
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;


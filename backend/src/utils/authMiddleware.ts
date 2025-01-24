import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload; 
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const accessToken = req.cookies?.accessToken || req.headers['cookie']?.split('; ').find((cookie) => cookie.startsWith('accessToken='))?.split('=')[1];

    if (!accessToken) {
        console.log(accessToken);
        console.log('Access token is undefined or missing');
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);
        req.user = decoded;
        res.status(200).json({ authenticated: true, user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;


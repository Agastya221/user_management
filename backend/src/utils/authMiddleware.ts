import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface AuthRequest extends Request {
    user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const accesstoken = req.cookies?.accessToken;

    if (!accesstoken) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(accesstoken, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;

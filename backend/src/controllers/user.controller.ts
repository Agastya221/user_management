import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload; // Define the user property
}

const generateAccessToken = (email: string) => {
    return jwt.sign({ email: email }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
};

const generateRefreshToken = (email: string) => {
    return jwt.sign({ email: email }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
};

// Register
export const registerUser = async (req: Request, res: Response) : Promise<void> => {
    const { name, dateOfBirth, email, password } = req.body;
    console.log(req.body);

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const accessToken = generateAccessToken(email);
        const refreshToken = generateRefreshToken(email);
        const user = new User({ name, dateOfBirth, email, password , refreshToken });
        await user.save();

        res.setHeader('Set-Cookie', [
            `accessToken=${accessToken}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${15 * 60}`, 
            `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}`
        ]);

        
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }) as IUser | null;
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);

        user.refreshToken = refreshToken;
        await user.save();


        res.setHeader('Set-Cookie', [
            `accessToken=${accessToken}; HttpOnly; Secure; SameSite=None; Max-Age=${15 * 60}`, 
            `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}`
        ]);

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


export const getAuthStatus = (req: AuthRequest, res: Response): void => {
    try {
     
        if (req.user) {
            res.status(200).json({ 
                authenticated: true, 
                user: req.user 
            });
        } else {
            res.status(200).json({ 
                authenticated: false 
            });
        }
    } catch (error) {
        console.error('Error in /auth/status:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};


// update user

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, dateOfBirth, email, role, status } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { name, dateOfBirth, email, role, status },
            { new: true, runValidators: true } 
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// delete user

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};





 
export const getallusers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// get user by id
export const getuserbyid = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    } 
};


export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Clear cookies 
        res.clearCookie('accessToken', {
            path: '/',
            domain: '.railway.app', 
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.clearCookie('refreshToken', {
            path: '/',
            domain: '.railway.app', 
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        // Optional: Set cookies to expire immediately
        res.setHeader('Set-Cookie', [
            'accessToken=; Path=/; Domain=.railway.app; HttpOnly; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'refreshToken=; Path=/; Domain=.railway.app; HttpOnly; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        ]);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error during logout' });
    }
};



// Refresh Token
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.cookies?.accessToken || req.headers['cookie']?.split('; ').find((cookie) => cookie.startsWith('accessToken='))?.split('=')[1];
    const refreshToken = req.cookies?.refreshToken || req.headers['cookie']?.split('; ').find((cookie) => cookie.startsWith('refreshToken='))?.split('=')[1];

    if(accessToken){
        console.log(accessToken);
        res.status(200).json({ message: 'accessToken already exist' });
        return;
    }

    if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token, authorization denied' });
        return;
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { email: string };
        const user = await User.findOne({ email: decoded.email });

        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }

        const newAccessToken = generateAccessToken(user.email);

        res.setHeader('Set-Cookie', `accessToken=${newAccessToken}; HttpOnly; Secure; SameSite=None; Max-Age=${15 * 60}`);

        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token', error });
    }
};


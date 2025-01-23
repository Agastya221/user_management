import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

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

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true , sameSite: 'none', maxAge: 15 * 60 * 1000 }); 
        res.cookie('refreshToken', refreshToken, { httpOnly: true,sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        
        
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
        const refreshToken = generateRefreshToken((user.email));

        user.refreshToken = refreshToken;
        await user.save();

        // Set tokens in cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true , sameSite: 'none', maxAge: 15 * 60 * 1000 }); 
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true,sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 }); 

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
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
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};


// Refresh Token
export const refreshAcessToken = async (req: Request, res: Response) : Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;

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
        res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token', error });
    }
};

import { type Request, type Response } from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateToken = (userId: string, role: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined.');
    }
    return jwt.sign(
        { userId, role },
        secret,
        { expiresIn: '1d' }
    );
};

export const googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID!,
        });
        
        const payload: TokenPayload | undefined = ticket.getPayload();
        
        if (!payload || !payload.email) {
            return res.status(400).json({ message: "Invalid Google Token" });
        }

        const email: string = payload.email;
        const name: string = payload.name || "Google User";
        const googleId: string = payload.sub;

        
        let user = await User.findOne({ email });

        if (!user) {
            
            user = await User.create({
                name,
                email,
                role: 'patient', 
                password: googleId, 
            });
        }

        const jwtToken = generateToken((user._id as any).toString(), user.role);

        res.status(200).json({
            token: jwtToken,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google Authentication failed" });
    }
};

interface AuthRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        role?: 'patient' | 'doctor';
    }
}

export const register = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).send("Please fill all required fields.");
        }
        
        const userExists = await User.findOne({ email: email as string });
        if (userExists) {
            return res.status(400).send("User already registered with this email.");
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'patient' 
        });

        await newUser.save();
        
        const token = generateToken((newUser._id as any).toString(), newUser.role);
        
        return res.status(201).json({
            message: "User registered successfully",
            token,
            role: newUser.role,
            userId: newUser._id
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: (error as Error).message });
    }
};

export const login = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email as string }).select('+password'); 
        
        if (!user) {
            return res.status(400).send("Invalid credentials.");
        }
        
        const validPassword = await bcrypt.compare(password, user.password || ''); 
        
        if (!validPassword) {
            return res.status(400).send("Invalid credentials.");
        }
        
        const token = generateToken((user._id as any).toString(), user.role);
        
        return res.status(200).json({ 
            message: "Login successful",
            token,
            role: user.role,
            userId: user._id
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: (error as Error).message });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.userId; 

        if (!userId) {
             return res.status(401).json({ message: 'User ID missing in token.' });
        }
        
        const user = await User.findById(userId); 

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ message: (error as Error).message });
    }
};
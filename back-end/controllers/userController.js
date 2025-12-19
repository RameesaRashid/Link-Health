import {} from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined.');
    }
    return jwt.sign({ userId, role }, secret, { expiresIn: '1d' });
};
export const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: "Invalid Google Token" });
        }
        const email = payload.email;
        const name = payload.name || "Google User";
        const googleId = payload.sub;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                role: 'patient',
                password: googleId,
            });
        }
        const jwtToken = generateToken(user._id.toString(), user.role);
        res.status(200).json({
            token: jwtToken,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google Authentication failed" });
    }
};
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send("Please fill all required fields.");
        }
        const userExists = await User.findOne({ email: email });
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
        const token = generateToken(newUser._id.toString(), newUser.role);
        return res.status(201).json({
            message: "User registered successfully",
            token,
            role: newUser.role,
            userId: newUser._id
        });
    }
    catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }).select('+password');
        if (!user) {
            return res.status(400).send("Invalid credentials.");
        }
        const validPassword = await bcrypt.compare(password, user.password || '');
        if (!validPassword) {
            return res.status(400).send("Invalid credentials.");
        }
        const token = generateToken(user._id.toString(), user.role);
        return res.status(200).json({
            message: "Login successful",
            token,
            role: user.role,
            userId: user._id
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: error.message });
    }
};
export const getProfile = async (req, res) => {
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
    }
    catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=userController.js.map
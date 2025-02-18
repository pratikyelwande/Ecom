import jwt from 'jsonwebtoken';
import { apiResponse } from '../utils/apiResponse.js';

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    if (!token) {
        return apiResponse.error(res, "Unauthorized: No token provided", 401);
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user data to the request object
        next();
    } catch (error) {
        return apiResponse.error(res, "Unauthorized: Invalid or expired token", 401);
    }
};

export const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return apiResponse.error(res, "Forbidden: Admin access required", 403);
    }
    next();
};
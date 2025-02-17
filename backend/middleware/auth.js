import { verifyToken } from '../utils/jwt.js';  // Import the verifyToken function
import { apiResponse } from '../utils/apiResponse.js';

export const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract the token from the Authorization header

    if (!token) {
        return apiResponse.error(res, 'No token provided', 403);
    }

    try {
        const decoded = verifyToken(token);

        req.user = decoded;  // Assuming decoded includes user_id, role, etc.
        next();  // Proceed to the next middleware or controller
    } catch (error) {
        return apiResponse.error(res, 'Invalid or expired token', 403);
    }
};

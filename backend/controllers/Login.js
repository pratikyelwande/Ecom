import { executeQuery } from "../config/db.js";
import { apiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { LoginSchema } from "../utils/schema.js";
import {generateToken} from "../utils/jwt.js";

export const loginUser = async (req, res) => {
    try {
        // Validate request body
        const parsedData = LoginSchema.parse(req.body);
        const { email, password } = parsedData;

        // Debug log
        console.log('Attempting login for email:', email);

        // Check if user exists - using uppercase for Snowflake column names
        const users = await executeQuery(
            'SELECT USER_ID, EMAIL, PASSWORD_HASH, ROLE FROM USERS WHERE EMAIL = ?',
            [email]
        );

        // Debug log
        console.log('Database response:', users);

        if (!users || users.length === 0) {
            console.log('No user found with email:', email);
            return apiResponse.error(res, 'Invalid credentials', 401);
        }

        const user = users[0];

        // Debug log
        console.log('Retrieved user data:', { ...user, PASSWORD_HASH: '[HIDDEN]' });

        // Verify password
        if (!user.PASSWORD_HASH) {
            console.error('Password hash not found for user:', email);
            return apiResponse.error(res, 'Invalid credentials', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.PASSWORD_HASH);

        // Debug log
        console.log('Password validation result:', isPasswordValid);

        if (!isPasswordValid) {
            return apiResponse.error(res, 'Invalid credentials', 401);
        }

        // Generate JWT token
        const tokenPayload = {
            user_id: user.USER_ID,
            email: user.EMAIL,
            role: user.ROLE
        };

        const token = generateToken(tokenPayload);

        // Return success response with token
        return apiResponse.success(
            res,
            {
                token,
                user: {
                    user_id: user.USER_ID,
                    email: user.EMAIL,
                    role: user.ROLE
                }
            },
            'Login successful',
            200
        );

    } catch (error) {
        console.error('Login Error:', error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map(err => err.message).join(', ');
            return apiResponse.error(res, errorMessage, 400);
        }

        // Handle database errors
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return apiResponse.error(res, 'Database configuration error', 500);
        }

        // Handle other errors
        return apiResponse.error(
            res,
            'An error occurred during login. Please try again.',
            500
        );
    }
};
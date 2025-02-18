import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from './config/db.js';
import PublicRoutes from "./routes/PublicRoutes.js";
import ProtectedRoutes from "./routes/ProtectedRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Database connection
(async () => {
    await connect();
})();

// Routes
app.use('/api/auth', PublicRoutes);
app.use('/api/protected', ProtectedRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
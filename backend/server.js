import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from './config/db.js';
import { apiResponse } from './utils/apiResponse.js';
import PublicRoutes from "./routes/PublicRoutes.js";

dotenv.config(); // Ensure this line is present and at the top

const app = express();
app.use(express.json());  // This will parse JSON request bodies
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
(async () => {
    await connect();
})();


app.use('/api/auth', PublicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
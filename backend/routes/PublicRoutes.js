import express from "express";
import { registerUser } from "../controllers/Register.js";
import { loginUser } from "../controllers/Login.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
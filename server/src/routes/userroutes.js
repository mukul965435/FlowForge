import express from "express";
import { getCurrentUser } from "../controllers/usercontroller.js";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);

export default router;
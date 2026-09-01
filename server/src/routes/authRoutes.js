import express from "express";
import {registerUser, loginUser, refreshAccessToken} from "../controllers/authcontroller.js";
import {logoutUser} from "../controllers/authcontroller.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;





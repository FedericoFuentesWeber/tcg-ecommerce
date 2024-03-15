import { Router } from "express";
import { LoginViewController } from "../controllers/loginView.controller.js";

const router = Router();
const {
    login,
    register
} = new LoginViewController();

router.get("/login", login);
router.get("/register", register);

export default router;
import { Router } from "express";
import { LoginViewController } from "../controllers/loginView.controller.js";

const router = Router();
const {
    login,
    register,
    recoverPassword,
    changePassword
} = new LoginViewController();

router.get("/login", login);
router.get("/register", register);
router.get("/recoverPassword", recoverPassword);
router.get("/changePassword", changePassword);

export default router;
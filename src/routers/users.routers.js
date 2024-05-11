import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";

const router = Router();

const {
    changeRole
} = new UserController();

router.get('/premium/:uid', changeRole);

export default router;
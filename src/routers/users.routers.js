import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";

const router = Router();

const {
    getAllUsers,
    getUserById
} = new UserController();

router.get('/', getAllUsers);
router.get('/:uid', getUserById);

export default router;
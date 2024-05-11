import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";

const router = Router();

const {
    getAllUsers,
    getUserById,
    changeRole
} = new UserController();

router.get('/', getAllUsers);
router.get('/:uid', getUserById);
router.get('/premium/:uid', changeRole);

export default router;
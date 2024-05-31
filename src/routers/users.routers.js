import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { storageDestinationFolder } from "../../utils.js";

const uploader = storageDestinationFolder("documents");

const router = Router();

const {
    getAllUsers,
    getUserById,
    changeRole,
    addDocuments,
    deleteUser
} = new UserController();

router.get('/', getAllUsers);
router.get('/:uid', getUserById);
router.get('/premium/:uid', changeRole);
router.post('/:uid/documents', uploader.array('documents'), addDocuments);
router.delete('/:uid', deleteUser);

export default router;
import { Router } from "express";
import { passportCall } from "../middleware/passportCall.middleware.js";
import { authorization } from "../middleware/authorization.middleware.js";
import UsersViewController from "../controllers/usersView.controller.js";

const router = Router();
const {
    getAllUsers
} = new UsersViewController();

router.get('/', passportCall("jwt"), authorization("ADMIN"), getAllUsers);


export default router;
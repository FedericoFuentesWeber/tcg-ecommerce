import { Router } from "express";
import { MessageManagerDB } from "../daos/DBManagers/MessageManager/MessageManagerDB.js";
import { ChatController } from "../controllers/chat.controller.js";

const router = Router();

const {
    getMessages
} = new ChatController();

router.get("/", getMessages);

export default router;
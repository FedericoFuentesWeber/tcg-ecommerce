import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";

const router = Router();

const {
    getMessages
} = new ChatController();

router.get("/", getMessages);

export default router;
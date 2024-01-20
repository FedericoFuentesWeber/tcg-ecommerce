import { Router } from "express";
import { MessageManagerDB } from "../daos/DBManagers/MessageManager/MessageManagerDB.js";

const router = Router();

const MessageManager = new MessageManagerDB();

router.get("/", async (req, res) => {
    try {
        const messages = await MessageManager.getMessages();

        res.status(200).render("chat", {
            title: "Mensajes",
            messages: messages
        });
    } catch(error) {
        return res.status(400).render("chat", {
            title: "Mensajes",
            errorMessage: error.message
        });
    }
});

export default router;
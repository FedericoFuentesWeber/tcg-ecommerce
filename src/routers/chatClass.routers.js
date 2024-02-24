import { RouterClass } from "./router.js";
import { MessageManagerDB } from "../daos/DBManagers/MessageManager/MessageManagerDB.js";

const messageManager = new MessageManagerDB();

class ChatRouter extends RouterClass {
    init() {
        this.get("/", ['USER', 'ADMIN'],async (req, res) => {
            try {
                const messages = await messageManager.getMessages();
        
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
    }
}

export { ChatRouter }
import { MessageManagerDB } from "../daos/DBManagers/MessageManager/MessageManagerDB.js"

class ChatController {
    constructor() {
        this.messageManager = new MessageManagerDB();
    }

    getMessages = async (req, res) => {
        try {
            const messages = await this.messageManager.getMessages();
    
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
    }
}

export { ChatController }
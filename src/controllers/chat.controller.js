import { messageService } from "../repositories/index.js";

class ChatController {
    constructor() {
        this.service = messageService;
    }

    getMessages = async (req, res) => {
        try {
            const messages = await this.service.getMessages();
    
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
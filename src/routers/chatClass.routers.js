import { RouterClass } from "./router.js";
import { ChatController } from "../controllers/chat.controller.js";

const {
    getMessages
} = new ChatController();
class ChatRouter extends RouterClass {
    init() {
        this.get("/", ['USER', 'ADMIN'], getMessages);
    }
}

export { ChatRouter }
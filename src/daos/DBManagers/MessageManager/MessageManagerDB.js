import { Message } from "../../../main/Message/Message.js";
import messageModel from "../../../models/message.model.js";

export class MessageManagerDB {

    createNewMessage = async ({
        userEmail,
        message
    }) => {
        return new Message({
            id: null,
            userEmail,
            message
        })
    }

    addMessage = async(message) => {
        try {
            if(
                !message.userEmail ||
                !message.message
            ) {
                throw new Error("Hay parámetros sin completar.")
            }

            const newMessage = await this.createNewMessage(message);
            messageModel.create(newMessage);

        } catch(error) {
            console.error(error.message);
        }
    }

    getMessages = async() => {
        try {
            const messages = await messageModel.find({});
            const parsedMessages = messages.map(
                (message) => new Message(message)
            );

            return parsedMessages;
            
        } catch(error) {
            console.error(error.message);
        }
    }
}
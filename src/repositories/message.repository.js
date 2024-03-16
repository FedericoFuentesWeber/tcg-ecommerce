class MessageRepository {
    constructor(messageManager) {
        this.manager = messageManager;
    }

    getMessages = async() => await this.manager.getMessages();
}

export { MessageRepository }
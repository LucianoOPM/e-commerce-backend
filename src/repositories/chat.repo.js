class ChatRepository {
    constructor(dao) {
        this.dao = dao
    }

    addMessage = async (data) => {
        try {
            return await this.dao.addMessage(data)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    getAllMessages = async () => {
        try {
            return await this.dao.getMessages()
        } catch (error) {
            throw new Error(error.message)
        }
    }

    getChat = async (email) => {
        try {
            return this.dao.getChat(email)
        } catch (e) {
            throw new Error(e.message)
        }
    }

    getLastMessage = async (email) => {
        try {
            const { messages } = await this.dao.readLastMessage(email)
            return messages[messages.length - 1]
        } catch (error) {
            throw new Error(error.message)
        }
    }

    createChat = async (user) => {
        try {
            await this.dao.newChat(user)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = ChatRepository
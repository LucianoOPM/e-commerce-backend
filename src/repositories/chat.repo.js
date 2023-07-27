class ChatRepository {
    constructor(dao) {
        this.dao = dao
    }

    addMessage = async (data) => {
        try {
            this.dao.addMessage(data)
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

    getLastMessage = async (userName) => {
        try {
            return await this.dao.readLastMessage(userName)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = ChatRepository
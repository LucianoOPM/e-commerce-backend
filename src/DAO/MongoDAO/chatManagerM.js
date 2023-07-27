const { messageModel } = require('../MongoDAO/models/chatModel.js')

class ChatManagerMongo {
    newChat = async (user) => {
        try {
            if (!user) {
                return `No hay usuario que ingresar`
            }
            return await messageModel.create(user)
        } catch (error) {
            return `ERROR: ${error}`
        }
    }

    getMessages = async () => {
        try {
            return await messageModel.find({})
        } catch (error) {
            throw new Error(error.message)
        }
    }
    addMessage = async (data) => {
        try {
            const { userName, newMsg } = data
            if (userName) {
                await messageModel.updateOne({ user: userName }, { $push: { message: { date: new Date(), content: newMsg } } })
            }

        } catch (error) {
            return `ERROR: ${error}`
        }
    }
    readLastMessage = async (uname) => {
        try {
            const userMsg = await messageModel.find({ user: uname }, { message: { $slice: -1 } })
            const { user, message } = userMsg[0]

            return { user, message }
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
}

module.exports = ChatManagerMongo
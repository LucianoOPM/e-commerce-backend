const { messageModel } = require('../MongoDAO/models/chatModel.js')

class ChatManagerMongo {
    newChat = async (user) => {
        try {
            return await messageModel.create({ user: user })
        } catch (error) {
            return `ERROR: ${error}`
        }
    }

    getChat = async (email) => {
        try {
            return await messageModel.findOne({ user: email })
        } catch (error) {
            throw new Error(error.message)
        }
    }

    getMessages = async () => {
        try {
            return await messageModel.find({})
        } catch (error) {
            throw new Error(error.message)
        }
    }
    addMessage = async ({ email, message }) => {
        try {
            return await messageModel.updateOne({ user: email }, { $push: { messages: { date: new Date(), message: message } } })
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
    readLastMessage = async (email) => {
        try {
            return await messageModel.findOne({ user: email })
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
}

module.exports = ChatManagerMongo
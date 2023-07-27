const { chatService } = require("../services")

const chatSocket = io => {
    io.on('connection', async socket => {
        try {
            const messages = await chatService.getLastMessage('Ana')
            io.emit('message', messages)
        } catch (error) {
            return error.message
        }
    })
}

module.exports = chatSocket
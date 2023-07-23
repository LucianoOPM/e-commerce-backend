const chatSocket = io => {
    io.on('connection', async socket => {

        socket.on('client:createUser', async (data) => {
            await chatMongo.newChat({ user: data })
        })

        socket.on('client:newMesage', async (data) => {
            await chatMongo.addMessage(data)

            const mensajes = []
            const fetchMessage = await chatMongo.readLastMessage(data.userName)
            mensajes.push(fetchMessage)

            io.emit('server:chatHistory', mensajes)
        })
    })
}

module.exports = chatSocket
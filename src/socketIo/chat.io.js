const { authUrl } = require("../config/passportJWT")
const { chatService } = require("../services")

const chatIo = async (io, socket) => {
  try {
    const { handshake } = socket
    const { cookie } = handshake.headers

    io.use((midSocket, next) => {
      if (!cookie) {
        next(new Error('user is not logged'))
      }
      next()
    })

    const token = cookie.split('=')[1]
    const user = authUrl(token)
    const { email, first_name, last_name, role } = user

    const haveChat = await chatService.getChat(email)
    if (!haveChat) {
      await chatService.createChat(email)
    }
    socket.on("client:message", async (info) => {
      await chatService.addMessage({ email, message: info })
      const { message } = await chatService.getLastMessage(email)
      const chatInfo = {
        first_name,
        last_name,
        message
      }

      io.emit("server:message", chatInfo)
    })

  } catch (error) {
    console.log(error.message)
  }
}

module.exports = chatIo

//obtener el nombre por la cookie del usuario
//guardar el mensaje con su nombre o email o _id en el documento
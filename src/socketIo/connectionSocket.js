const { authUrl } = require("../config/passportJWT")
const chatIo = require("./chat.io")
const realTimeProductsIo = require("./realtimeproducts.io")

const onConnection = (io) => {
  const socketHandler = async (socket) => {
    chatIo(io, socket)
    io.use((socket, next) => {
      const { handshake } = socket
      const { cookie } = handshake.headers
      const token = cookie.split('=')[1]
      const user = authUrl(token)
      if (user.role === 'ADMIN' || user.role === "premium") {
        next()
      } else {
        next(new Error('no permission'))
      }
    })
    realTimeProductsIo(io, socket)
  }
  io.on('connection', socketHandler)
}

module.exports = onConnection
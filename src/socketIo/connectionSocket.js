const chatIo = require("./chat.io")
const realTimeProductsIo = require("./realtimeproducts.io")

const onConnection = (io) => {
  const socketHandler = async (socket) => {
    chatIo(io, socket)
    realTimeProductsIo(io, socket)
  }
  io.on('connection', socketHandler)
}

module.exports = onConnection
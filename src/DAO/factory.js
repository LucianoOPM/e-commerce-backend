const { connectDB } = require("../config/DBConfig");
const { PERSISTENCE } = require("../config/config");

const FACTORY = {
    MONGO: {
        connection: connectDB(),
        ProductDAO: require('./MongoDAO/productMMongo'),
        UserDAO: require('./MongoDAO/usersManagerM'),
        CartDAO: require('./MongoDAO/cartManagerM'),
        TicketDAO: require('./MongoDAO/ticketDAO'),
        ChatDAO: require('./MongoDAO/chatManagerM')
    },
    FILESYSTEM: {
        UserDAO: require('./FSDAO/userDAO'),
        ProductDAO: require('./FSDAO/proManJSON'),
        CartDAO: require('./FSDAO/cartsManager'),
        TicketDAO: require('./FSDAO/ticketFS'),
        ChatDAO: require('./FSDAO/chat.dao')
    },
    MEMORY: {
        ProductDAO: require('./MemoryDAO/products.DAO'),
        UserDAO: require('./MemoryDAO/users.dao'),
        CartDAO: require('./MemoryDAO/carts.dao'),
        TicketDAO: require('./MemoryDAO/TicketDao'),
        ChatDao: require('./MemoryDAO/chat.dao')
    }
}

module.exports = FACTORY[PERSISTENCE]
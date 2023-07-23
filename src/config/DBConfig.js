const MongoSingleton = require('../utils/singleton')

module.exports = {
    connectDB: async () => await MongoSingleton.getInstance()
}
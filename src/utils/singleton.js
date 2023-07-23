const { connect } = require('mongoose')
const logger = require('../config/logger');

class MongoSingleton {
    static #instance
    constructor() {
        connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    static getInstance = () => {

        if (this.#instance) {
            logger.warning('Database is already connected.');
            return this.#instance
        }

        this.#instance = new MongoSingleton()
        logger.info('Database connected');
        return this.#instance
    }
}

module.exports = MongoSingleton
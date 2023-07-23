const RouterClass = require("./RouterClass");
const LoggerController = require('../controllers/logger.controller')
const loggerController = new LoggerController()

class LoggerRouter extends RouterClass {
    init() {
        this.get('/fatal', ['ADMIN'], loggerController.fatal)
        this.get('/error', ['ADMIN'], loggerController.error)
        this.get('/warning', ['ADMIN'], loggerController.warning)
        this.get('/info', ['ADMIN'], loggerController.info)
        this.get('/http', ['ADMIN'], loggerController.http)
        this.get('/debug', ['ADMIN'], loggerController.debug)
    }
}

module.exports = LoggerRouter
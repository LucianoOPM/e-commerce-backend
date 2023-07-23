const logger = require("../config/logger")

const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`Se realizó un ${req.method} en la ruta ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

module.exports = addLogger
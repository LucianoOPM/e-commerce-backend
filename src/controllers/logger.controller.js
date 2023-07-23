const logger = require('../config/logger.js')
class LoggerController {
    fatal = (req, res) => {
        try {
            logger.fatal("Fatal error")
            res.status(200).sendSuccess('Error fatal enviado')
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    error = (req, res) => {
        try {
            logger.error('error')
            res.status(200).sendSuccess('Error enviado')
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    warning = (req, res) => {
        try {
            logger.warning('warning')
            res.status(200).sendSuccess('warning enviado')
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    info = (req, res) => {
        try {
            logger.info('info')
            res.status(200).sendSuccess('info enviado')
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    http = (req, res) => {
        try {
            logger.http('http')
            res.status(200).sendSuccess('http enviado')
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    debug = (req, res) => {
        try {
            logger.debug('debug')
            res.status(200).sendSuccess('debug enviado')
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }
}

module.exports = LoggerController
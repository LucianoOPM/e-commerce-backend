const winston = require('winston')

/* 
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: "http" }),
        new winston.transports.File({ filename: './error.log', level: 'warn' })
    ]
}) 
Configuración del logger
*/
/**
 * Custom configuration for Winston transports
 * @typedef {Object} customLevelPriority
 * @property { Object } levels The hierarchy of the chosen levels.
 * @property { Object } colors Code for every hierarchy level
 */
const customLevelPriority = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "black yellowBG",
        info: "blue",
        http: "green",
        debug: "black whiteBG",
    }
}

/**
 * Logger configuration to each environment, development or production
 * @typedef {Object} LOGGER_LEVELS
 * @property { winston.config } devLogger Configuration if the app is launched like development
 * @property { winston.config } proLogger Configuration if the app is launched like production
 */
const LOGGER_LEVELS = {
    devLogger: winston.createLogger({
        levels: customLevelPriority.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelPriority.colors }),
                    winston.format.simple())
            })
        ]
    }),
    proLogger: winston.createLogger({
        levels: customLevelPriority.levels,
        transports: [
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelPriority.colors }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: "./errors.log",
                level: "error",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelPriority.colors }),
                    winston.format.simple()
                ),
            })
        ]
    })
}

module.exports = LOGGER_LEVELS[process.argv.includes('production') ? "proLogger" : "devLogger"]
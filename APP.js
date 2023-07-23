const { initServer } = require("./src/main");
const cluster = require('cluster')
const { cpus } = require('os')
const logger = require('./src/config/logger.js')

if (cluster.isPrimary) {
    for (let i = 0; i < cpus().length; i++) {
        cluster.fork()
    }
    cluster.on('message', worker => {
        logger.info(`El worker ${worker.process.id} dice ${worker.message}`)
    })
} else {
    initServer()
}
const jsdoc = require('swagger-jsdoc')

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'E-Commerce-API',
            description: 'Here you can found info about all routes in the API',
            version: '1.0.0'
        },
        servers: [
            { url: "http://localhost:8080" }
        ]
    },
    apis: [`./src/docs/**/*.yaml`]
}

module.exports = jsdoc(swaggerOptions)
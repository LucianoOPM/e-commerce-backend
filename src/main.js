//Importaciones
const express = require('express')
const hbs = require('express-handlebars')
const { Server: serverHTTP } = require('node:http')
const { Server: serverIO } = require('socket.io')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require('cors')
const main = require('./routers/routes.js')
const initPassport = require('./config/passport.config.js')
const errorMiddleware = require('./middleware/errors/indexError.js')
const addLogger = require('./middleware/logger.midd.js')
const logger = require('./config/logger.js')
const onConnection = require('./socketIo/connectionSocket.js')

//Ejecucion de funciones.
const app = express()
const serverHttp = new serverHTTP(app)
const io = new serverIO(serverHttp)
initPassport()

//Configuraciones
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', hbs.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.use('/static', express.static(`${__dirname}/public`))
app.use(cookieParser("S1gn3d Co0k13"))
passport.use(passport.initialize())

//routers
app.use(addLogger)
app.use(main)
onConnection(io)
app.use(errorMiddleware)

/* exports.initServer = _ =>  */
serverHttp.listen(process.env.PORT, (err) => {
    if (err)`ERROR en el servidor ${err}`
    logger.info(`Server listen on http://localhost:${process.env.PORT}`)
    logger.info(`API Docs are aviable at http://localhost:${process.env.PORT}/docs`)
})
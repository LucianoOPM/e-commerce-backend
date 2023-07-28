const { authHeaders } = require("../config/passportJWT");
const ViewsController = require("../controllers/viewsv2.controller");
const alreadyLogged = require("../middleware/alreadyLogged");
const RouterClass = require("./RouterClass");
const validUrlToken = require('../middleware/validateUrlToken')
const swagger = require('swagger-ui-express')
const swaggerJSOption = require('../config/swagger-js-doc')

const views = new ViewsController()

class ViewsRouter extends RouterClass {
    /*QUIEN PUEDE ACCEDER A LAS VISTAS*/
    init() {
        this.get('/docs', ['PUBLIC'], swagger.setup(swaggerJSOption))
        /*Views de products*/
        this.get('/products', ['PUBLIC'], authHeaders, views.products)//Funciona
        this.get('/products/:PID', ['PUBLIC'], authHeaders, views.productsById)//Funciona
        /*Views session*/
        /*Login*/
        this.get('/login', ['PUBLIC'], authHeaders, alreadyLogged, views.login)//Funciona//Para todos los usuarios, pero si ya está logueado, redirigir a productos
        // this.get('/logout', ['PUBLIC'], views.logout)
        this.get('/register', ['PUBLIC'], authHeaders, alreadyLogged, views.register)//Funciona//Para todos los usuarios, pero si ya está logueado redirigir a productos
        this.get('/restore', ['PUBLIC'], views.restore)//Funciona
        this.get('/restore/:UID/:token', ['PUBLIC'], validUrlToken, views.newPassword)
        /*Realtimeproducts*/
        this.get('/realtimeproducts', ['ADMIN'], views.realtimeproducts)//Funciona//Sólo para personal autorizado(admins)
        /*chat*/
        this.get('/chat', ['USER', 'ADMIN'], views.chat)//Implementado, pero no funciona
        this.get('/cart/:cid', ['USER', 'ADMIN'], views.userCart)
    }
}

module.exports = ViewsRouter

//Si viene el authorization o cookie es porque ya está logueado > login no acceso > register no acceso
//Todos pueden acceder a products
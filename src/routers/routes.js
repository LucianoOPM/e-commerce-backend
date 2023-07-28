const { Router } = require('express')
const router = Router()
const compression = require('express-compression')
const swagger = require('swagger-ui-express')

//API v2 imports
const ProductsV2 = require('./product.router.js')
const UserRouterV2 = require('./users.router.js');
const SessionRouterV2 = require('./session.router.js')
const ViewsRouterV2 = require('./views.router.js')
const CartRouterV2 = require('./carts.router.js');
const MockingProductsRouter = require('./mock.product.router.js');
const LoggerRouter = require('./logger.router.js');
const MockingUsers = require('./mock/users.test.router.js');

//API V2 Instances
const productsv2 = new ProductsV2()
const usersv2 = new UserRouterV2()
const sessionv2 = new SessionRouterV2()
const viewsv2 = new ViewsRouterV2()
const cartsv2 = new CartRouterV2()
const mocking = new MockingProductsRouter()
const logger = new LoggerRouter()
const mockingUsers = new MockingUsers()

//API v2 endpoints
router.use(compression({ brotli: { enabled: true, zlib: {} } }))
router.use('/docs', swagger.serve)
router.use('/', viewsv2.getRouter())//Ruta de vistas
router.use('/api/products', productsv2.getRouter())//Funciona
router.use('/api/users', usersv2.getRouter())//Funciona
router.use('/api/session', sessionv2.getRouter())
router.use('/api/carts', cartsv2.getRouter())//Funciona
router.use('/mockingproducts', mocking.getRouter())
router.use('/mockingusers', mockingUsers.getRouter())
router.use('/loggertest', logger.getRouter())

router.use('*', (_req, res) => {
    res.status(404).send({
        status: 'Error',
        payload: 'Not Found'
    })
})

module.exports = router
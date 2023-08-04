const CartController = require("../controllers/cartsv2.controller");
const cartValidator = require("../middleware/userCartValidation");
const RouterClass = require("./RouterClass");

const cart = new CartController()

class CartRouter extends RouterClass {
    init() {
        this.post('/', ['PUBLIC'], cart.newCart)//generar un carrito nuevo
        this.get('/:CID', ['PUBLIC'], cart.get)//Funciona
        this.put('/:CID', ['USER', 'ADMIN', 'PREMIUM'], cartValidator, cart.addProducts)//Funciona
        this.delete('/:CID', ['PUBLIC'], cart.delete)//Funciona
        this.put('/:CID/product/:PID', ['PUBLIC'], cart.updateProduct)//Funciona
        this.delete('/:CID/product/:PID', ['PUBLIC'], cart.deleteProduct)//Funciona
        this.post('/:CID/purchase', ['USER', "ADMIN"], cart.purchase)//Funciona
    }
}

module.exports = CartRouter
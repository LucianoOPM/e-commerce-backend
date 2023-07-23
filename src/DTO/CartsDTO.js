class CartDto {
    constructor(cart) {
        this.cartID = cart._id.toString()
        this.products = cart.products
    }
}

module.exports = CartDto
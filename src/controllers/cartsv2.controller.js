const { isValidObjectId } = require("mongoose")
const { cartService, ticketService, productService } = require("../services")
const { randomUUID } = require('crypto')
const logger = require('../config/logger.js')

class CartController {
    newCart = async (_req, res) => {
        try {
            const { _id } = await cartService.newCart()
            res.status(200).sendSuccess({ message: 'Nuevo carrito generado', cartID: _id.toString() })
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    get = async (req, res) => {
        try {
            const { CID } = req.params
            if (!isValidObjectId(CID)) throw new Error('Cart isn\'t a valid objectID')

            const cartInfo = await cartService.get(CID)
            const products = cartInfo?.products

            if (!products) throw new Error("Cart is not found")

            res.status(200).sendSuccess({ CID, products })
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    addProducts = async (req, res) => {
        try {
            //Destructuración de los datos a manejar, id del carrito, id del producto y la cantidad que por default siempre será 1
            const { params: { CID }, body, user: { UID } } = req

            if (body.length === 0) throw new Error('Empty cart')
            let { products: cartProducts } = await cartService.get(CID) ?? {}

            if (!cartProducts) throw new Error("Cart is not found")
            //Recorrer el arreglo products en busca del req.body product, si no lo encuentra pushearlo, si lo encuentra aumentar su cantidad

            let ownProduct;
            //Valida que el ID del producto y del carrito sean un objectID valido.
            for (let item of body) {
                const { product, quantity } = item
                if (!isValidObjectId(CID) || !isValidObjectId(product)) throw new Error("Cart ID or Product ID is not a valid ID")

                const productExists = await productService.getById(product)
                if (productExists.owner.toString() !== UID) {
                    //Validamos que el producto que estamos recibiendo, se encuentro o no dentro del carrito
                    const findProduct = cartProducts.findIndex(productsObject => productsObject.product._id.toString() === product)

                    if (findProduct === -1) {
                        await cartService.add(CID, product, quantity)
                    }
                    if (findProduct !== -1) {
                        await cartService.update(CID, product, quantity)
                    }
                }
                ownProduct = productExists.owner.toString() === UID ? "Se encontraron productos que le pertenecen a este usuario, se agregaron unicamente los productos que no le pertenecen" : "Productos agregadon o actualizados con éxito"
            }

            let { products } = await cartService.get(CID)
            return res.status(200).sendSuccess({ message: ownProduct, products })
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    updateProduct = async (req, res) => {
        try {
            const { body: { quantity }, params: { CID, PID } } = req

            if (!quantity) throw new Error('Quantity not specified')
            if (quantity <= 0) throw new Error("Quantity can't be less than one")
            if (!isValidObjectId(CID) && !isValidObjectId(PID)) throw new Error('Some ID is not an valid ObjectID')

            const { products } = await cartService.get(CID)

            const productInside = products.findIndex(cartProduct => cartProduct.product._id.toString() === PID)


            if (productInside === -1) {
                throw new Error('Product not found')
            }

            const updateQuantity = await cartService.update(CID, PID, quantity)

            res.status(200).sendSuccess(updateQuantity)
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    //Elimina todos los productos de un carrito
    delete = async (req, res) => {
        try {
            const { CID } = req.params
            if (!isValidObjectId(CID)) throw new Error('Cart ID isn\'t a valid Object ID')

            const cartExists = await cartService.get(CID)

            if (!cartExists) throw new Error('Cart doesn\'t exists')

            const clearCart = await cartService.clear(CID)

            res.status(200).sendSuccess(clearCart)
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }

    //Elimina un producto de un carrito
    deleteProduct = async (req, res) => {
        try {
            const { CID, PID } = req.params
            if (!isValidObjectId(CID) && !isValidObjectId(PID)) return res.status(400).sendServerError('Cart ID or Product ID are not a valid Object ID')

            const { products } = await cartService.get(CID)
            const findProduct = products.find(cartProduct => cartProduct.product._id.toString() === PID)
            if (!findProduct) return res.status(400).sendServerError('Product is not inside of this cart')

            const delProduct = await cartService.delProduct(CID, PID)

            res.status(200).sendSuccess(delProduct)
        } catch (error) {
            logger.error(error.message)
            res.status(500).sendServerError(error.message)
        }
    }


    purchase = async (req, res) => {
        try {
            const { CID } = req.params

            const { products } = await cartService.get(CID) ?? {}

            if (!products) throw new Error("Cart not found")
            if (products.length === 0) throw new Error('Cart is empty')

            //Array con los productos que no son comprables
            const unbuyableProducts = products.filter(product => product.product.stock < product.qty).map(item => item.product._id.toString())

            let totalCompra = 0;
            //Se pueden comprar todos los productos
            if (unbuyableProducts.length === 0) {
                products.forEach(async item => {
                    const { product, qty } = item
                    totalCompra += product.price * qty
                    await productService.update(product._id.toString(), { stock: product.stock - qty })
                    await cartService.clear(req.user.CID)

                })
                const generateTicket = await ticketService.newTicket(randomUUID(), totalCompra, req.user.email)
                return res.status(200).sendSuccess(generateTicket)
            }

            //Se guardan los productos que si están disponibles
            const buyableProducts = [];

            products.forEach(item => {
                const findBuyable = unbuyableProducts.find(noStockProductsid => noStockProductsid === item.product._id.toString())
                if (!findBuyable) buyableProducts.push(item)
            })

            //No se pudo comprar ningun producto
            if (buyableProducts.length === 0) throw new Error({ message: "Can't complete the purchase process", products: unbuyableProducts })

            //Se pueden comprar algunos productos
            for (const item of buyableProducts) {
                const { product, qty } = item
                totalCompra += product.price * qty
                //actualizar los productos que si se compraron
                await productService.update(product._id.toString(), { stock: product.stock - qty })
                //Retirar del carrito los productos que si se compraron
                await cartService.delProduct(req.user.CID, product._id.toString())
            }
            const generateTicket = await ticketService.newTicket(randomUUID(), totalCompra, req.user.email)

            res.status(200).sendSuccess({ message: 'Compra realizada', ticket: generateTicket, productosNoDisponibles: unbuyableProducts })
        } catch (error) {
            logger.error(error.message)
            return res.status(500).sendServerError(error.message)
        }
    }
}
module.exports = CartController
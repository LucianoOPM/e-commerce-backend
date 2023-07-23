const { cartModel } = require('../MongoDAO/models/cartModel.js')

class CartManagerM {
    newCart = async (cart) => {
        try {
            return await cartModel.create(cart)
        } catch (error) {
            return `ERROR: ${error}`
        }
    }

    /**
     * Funcion de busqueda del carrito para validar datos o para visualizar el interior del carrito
     * @param {String} cid El objectID creado por mongoose en forma de String por la refactorizacion de el DTO
     * @returns {Array} Retorna un array con los datos del carrito como si contiene productos o no y el ID de los productos y el ID del carrito
     */
    findCart = async (cid) => {
        try {
            return cartModel.findOne({ _id: cid }).populate("products.product").lean()
        } catch (error) {
            throw error
        }
    }

    getCarts = async (params) => {
        try {
            return await cartModel.paginate({ _id: params }, {
                lean: true,
                populate: 'products.product'
            })
        } catch (error) {
            throw error
        }
        //Retorna los carritos según la query que se requiera, ya sea limit, cid y si no es ninguna de las dos, por defecto trae todos los carritos
    }

    /**
     * Método para actualizar la cantidad total del producto.
     * @param {String} cartID ID del carrito a actualizar
     * @param {String} productID ID del producto a actualizar
     * @param {Number} pQuantity Cantidad total a incrementar del producto
     * @returns {Promise<Object>}
     */
    updateProduct = async (cartID, productID, pQuantity) => {
        try {
            return await cartModel.updateOne({ _id: cartID, 'products.product': productID }, { $inc: { "products.$.qty": pQuantity } }, { returnDocument: "after" })
        } catch (error) {
            throw error
        }
    }

    /**
     * Método para ingresar productos nuevos al carrito de compras.
     * @param {import('mongoose').ObjectId<String>} cartID ID del carrito a introducir los productos
     * @param {import('mongoose').ObjectId<String>} productID ID del producto que se introducirá en el carrito
     * @param {Number} quantity Cantidad total que tendrá el producto a ingresar
     * @returns {Object}
     */
    addProduct = async (cartID, productID, quantity) => {
        try {
            return await cartModel.findOneAndUpdate({ _id: cartID }, { $push: { products: { product: productID, qty: quantity } } }, {
                returnDocument: 'after',
                lean: true,

            })
        } catch (error) {
            throw error
        }
    }

    /**
     * Método para eliminar los productos de un producto de compras.
     * @param {String} cid ID del carrito de compras
     * @returns {Object}
     */
    clearCart = async (cid) => {
        try {
            //Actualizar el carrito con el operador $pull el cual remueve de un array las instancias encontradas según la condicion especificada
            //https://www.mongodb.com/docs/v5.2/reference/operator/update/pull/
            return await cartModel.updateOne({ _id: cid }, { $pull: { products: {} } })
        } catch (error) {
            throw error.message
        }
    }

    /**
     * Método para eliminar un producto del carrito de compras.
     * @param {String} CID ID del carrito que contiene el producto
     * @param {String} PID ID del producto a eliminar en cuestion
     * @returns {Promise<Object>}
     */
    delProduct = async (CID, PID) => {
        try {
            return await cartModel.updateOne({ _id: CID }, { $pull: { products: { product: PID } } })
        } catch (error) {
            throw error.message
        }
    }

    deleteCart = async (CID) => {
        try {
            return await cartModel.deleteOne({ _id: CID })
        } catch (error) {
            throw error
        }
    }
}

module.exports = CartManagerM
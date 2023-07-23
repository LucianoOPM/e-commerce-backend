const CartDTO = require('../DTO/CartsDTO')

class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    /**
     * Retorna el ID del carrito que será del usuario que se registro en la página.
     * @returns {Object<String>}
     */
    newCart = async () => {
        try {
            return this.dao.newCart()
        } catch (error) {
            throw error
        }
    }

    /**
     * Método que elimina todo el carrito de compras, unicamente se utiliza cuando se elimina la cuenta de un usuario.
     * @param {String} cid ID del carrito a eliminar
     * @returns {Promise<Object>}
     */
    deleteCart = async (cid) => {
        try {
            return await this.dao.deleteCart(cid)
        } catch (error) {
            throw error
        }
    }

    /**
     * Funcion para validar si dicho carrito existe o no
     * @param {String} CID Recibe un String que es el ID del carrito con el que se está trabajando
     * @returns {Array} Retornará un array con los datos del carrito, contiene productos en su interior o no y respectivos ID del carrito y los productos
     */
    get = async (CID) => {
        try {
            const products = await this.dao.findCart(CID) ?? undefined
            return products
        } catch (error) {
            throw error
        }
    }

    /**
     * Método para normalizar la inserción del producto al carrito
     * @param {String} cid ID del carrito al que se le ingresarán los nuevos productos
     * @param {String} pid ID del producto a ingresar en el carrito
     * @param {Number} pQuantity Cantidad total del producto a ingresar
     * @returns {Promise<Object>} Retorna una promesa con el objeto del producto actualizado con el producto adentro y la cantidad ingresada.
     */
    add = async (cid, pid, pQuantity) => {
        try {
            return await this.dao.addProduct(cid, pid, pQuantity)
        } catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param {String} cartID ID del carrito de compras
     * @param {String} productID ID del producto a actualizar
     * @param {Number} quantity Cantidad total a actualizar del producto
     */
    update = async (cartID, productID, quantity) => {
        try {
            return await this.dao.updateProduct(cartID, productID, quantity)
        } catch (error) {
            throw error
        }
    }

    /**
     * Método para eliminar un producto del carrito de compras.
     * @param {String} cartID ID del carrito a eliminar
     * @param {String} productID ID del producto a eliminar
     */
    delProduct = async (cartID, productID) => {
        try {
            return await this.dao.delProduct(cartID, productID)
        } catch (error) {
            throw error
        }
    }

    /**
     * Método para eliminar todos los productos de un carrito de compras.
     * @param {String} cartID ID del carrito
     */
    clear = async (cartID) => {
        try {
            return await this.dao.clearCart(cartID)
        } catch (error) {
            throw error
        }
    }
}

module.exports = CartRepository
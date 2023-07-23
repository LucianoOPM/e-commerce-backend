const { promises } = require('fs')
const fs = promises

const pathProductos = './src/productsManager/data.json'//Ruta dónde se ubica el JSON de los productos

class CartManager {
    constructor(path) {
        this.path = path
        this.#crearArchivo()
        this.cart = []
    }
    #crearArchivo = async () => {//función que crea el JSON de los carritos vacios
        try {
            await fs.access(this.path, fs.constants.F_OK)
            const validar = await fs.readFile(this.path, "utf-8")
            JSON.parse(validar)
        } catch (error) {
            await fs.writeFile(this.path, "[]", "utf-8")
        }
    }

    #fetchAndParse = async (cartPath) => {//Función que hace un fetch a la ruta especificada
        try {
            const fetchCart = await fs.readFile(cartPath, "utf-8")
            const jsonCart = JSON.parse(fetchCart)
            return jsonCart
        } catch (error) {
            return `ERROR: ${error}`
        }
    }

    newCart = async () => {
        try {
            const jsonCart = await this.#fetchAndParse(this.path)

            this.cart = jsonCart

            if (this.cart.length === 0) {
                const newCart = { id: 1, products: [] }
                this.cart.push(newCart)

                const dataToString = JSON.stringify(this.cart, null, 2)
                await fs.writeFile(this.path, dataToString, "utf-8")

                return "Carrito generado correctamente."
            }
            this.cart.push({ id: this.cart[this.cart.length - 1].id + 1, products: [] })
            const dataToString = JSON.stringify(this.cart, null, 2)
            await fs.writeFile(this.path, dataToString, "utf-8")

            return "carrito creado correctamente."
        } catch (error) {
            return `ERROR: Ah ocurrido un error ${error}`
        }
    }

    previewCart = async (pid) => {
        try {
            const cartParse = await this.#fetchAndParse(this.path)

            const found = cartParse.find(product => product.id == pid)

            if (!found) return "No se encontró carrito con el ID establecido."

            const { products } = found
            return products

        } catch (error) {
            return `ERROR: ${error}`
        }
    }

    addToCart = async (cartID/*ID CARRITO*/, productID/*ID PRODUCTO*/) => {//arreglar este campo
        try {
            if (typeof productID !== 'object') return "No se pudo agregar el objeto al carrito"
            const fetchCart = await this.#fetchAndParse(this.path)
            const cartIndex = fetchCart.findIndex((cart) => cart.id == cartID)//Me devuelve la posición en la cual se encuentra el carrito con el ID especificado.

            if (cartIndex === -1) return "No se encontró el carrito"
            const { products } = fetchCart[cartIndex]//array vacio
            const productIndex = products.findIndex((product) => product.id == productID.id)//busca dentro del array si hay un objeto con el id especificado y devuelve su posición

            if (productIndex === -1) {
                products.push({ id: parseInt(productID.id), quantity: 1 })
                const addedProduct = JSON.stringify(fetchCart, null, 2)
                await fs.writeFile(this.path, addedProduct, "utf-8")
                return "Agregado correctamente"
            }
            products[productIndex].quantity += 1

            const addedProduct = JSON.stringify(fetchCart, null, 2)
            await fs.writeFile(this.path, addedProduct, "utf-8")
            return "Se agregó al carrito de compras."
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
}

module.exports = CartManager
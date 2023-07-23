const fs = require('fs')
const fsPromises = fs.promises


class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path
        this.#crearArchivo()
    }
    async#crearArchivo() {
        if (!fs.existsSync(this.path)) {
            await fsPromises.writeFile(this.path, "[]", "utf-8")
        }
        if (fs.existsSync(this.path)) {
            const fetchData = await fsPromises.readFile(this.path, "utf-8")
            if (fetchData.length === 0) {
                await fsPromises.writeFile(this.path, "[]", "utf-8")
            }
        }
    }
    async getProducts(limit) {
        try {
            const data = await fsPromises.readFile(this.path, "utf-8")
            const dataToJson = JSON.parse(data)
            if (isNaN(parseInt(limit)) || !limit) return dataToJson
            if (limit > dataToJson.length) return "Error: The value is greater than the quantity of products."
            return dataToJson.slice(0, limit)
        } catch (error) {
            return `Se a producido un error al traer el archivo ${error}`
        }
    }
    async getProductById(idProduct) {
        try {

            const read = await fsPromises.readFile(this.path, "utf-8")
            const readToObject = JSON.parse(read)
            const find = readToObject.find(value => value.id === parseInt(idProduct))
            return find ? find : "No se encontró un producto con el ID proporcionado"
        } catch (error) {
            return `Se a producido un error al traer el archivo ${error}`
        }
    }
    async updateProduct(idProduct, changes) {
        try {
            const read = await fsPromises.readFile(this.path, "utf-8")
            const readToObject = JSON.parse(read)

            const find = readToObject.find(value => value.id === parseInt(idProduct))
            if (!find) return `No se encontró un objeto con el ID: ${idProduct}`

            Object.assign(find, changes)
            find.id = parseInt(idProduct)

            const objectToString = JSON.stringify(readToObject, "null", 2)
            await fsPromises.writeFile(this.path, objectToString, "utf-8")

            return `Se ah modificado el producto con el ID: ${idProduct}`
        } catch (error) {
            return `Se a producido un error al traer el archivo ${error}`
        }
    }
    async deleteProduct(id) {
        try {
            const fetchJson = await fsPromises.readFile(this.path, "utf-8")
            const jsonToObject = JSON.parse(fetchJson)
            const indexProduct = jsonToObject.findIndex((product) => product.id == id)
            if (indexProduct !== -1) {
                jsonToObject.splice(indexProduct, 1)
                let objectToJSON = JSON.stringify(jsonToObject, "null", 2)
                fsPromises.writeFile(this.path, objectToJSON)
                return `Se ah eliminado el objeto con id ${id}`
            }
            return "No se encontró un valor con ese ID"
        } catch (error) {
            return `Se a producido un error al traer el archivo ${error}`
        }
    }
    async addProduct({ title, description, price, thumbnail, code, stock, status, category }) {
        try {
            const fetchProducts = await fsPromises.readFile(this.path, "utf-8")
            this.products = JSON.parse(fetchProducts)

            if (!title || !description || !price || !code || !stock || !status || !category) return "Favor de verificar que todos los valores se hayan ingresado correctamente"

            let newProduct = { title, description, price, thumbnail, code, stock, status, category }
            let repetedCode = this.products.every(product => product.code.toLowerCase() !== newProduct.code.toLowerCase())
            if (!repetedCode) return "El producto repite su código, favor de verificarlo"
            if (this.products.length === 0) {
                this.products.push({ id: 1, ...newProduct })
                let dataToString = JSON.stringify(this.products, "null", 2)
                await fsPromises.writeFile(this.path, dataToString, "utf-8")
                return "El producto se ingresó correctamente"
            }
            this.products.push({ id: parseInt(this.products[this.products.length - 1].id) + 1, ...newProduct })
            let dataToString = JSON.stringify(this.products, "null", 2)
            await fsPromises.writeFile(this.path, dataToString, "utf-8")
            return "El producto se ingresó correctamente"

        } catch (error) {
            return `Se ah producido un error al cargar el producto ${error}`
        }
    }
}

module.exports = ProductManager
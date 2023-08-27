const ProductDTO = require('../DTO/ProductsDTO')

class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    paginate = async (req) => {
        try {
            const { docs, ...pagination } = await this.dao.getProducts(req)

            const products = ProductDTO.getProducts(docs)

            return { products, pagination }
        } catch (error) {
            throw error
        }
    }

    getById = async (PID) => {
        try {
            const doc = await this.dao.getProductById(PID)
            if (!doc) {
                throw new Error('Product not found')
            }
            const product = ProductDTO.getProduct(doc)
            return product
        } catch (error) {
            throw error
        }
    }

    /**
     * Método de creación de un nuevo producto para la base de datos.
     * @param {Object<any>} product Recibe un objeto que es todo el producto.
     */
    create = async (product) => {
        try {
            return await this.dao.createProduct(product)
        } catch (error) {
            throw error
        }
    }

    getByCode = async (pCode) => {
        try {
            return await this.dao.getProductByCode(pCode)
        } catch (error) {
            throw error
        }
    }

    /**
     * Método para actualizar el producto según un objeto pasado por el cuerpo de la peticion.
     * @param {String} productID ID del producto a modificar
     * @param {Object<any>} changes Valor del producto que se desea modificar pasado como objeto
     * @returns {Promise<object> | Error} Retorna una promesa que es el objeto ya actualizado si todo sale bien, si no, retorna un error
     */
    update = async (productID, changes) => {
        try {
            return await this.dao.updateProduct(productID, changes)
        } catch (error) {
            throw error
        }
    }

    /**
     * Method to delete a product just giving an Product ID
     * @param {String} productID ID of product to being deleted
     * @returns {Promise<object>}
     */
    delete = async productID => {
        try {
            return await this.dao.delete(productID)
        } catch (error) {
            throw error
        }
    }
}

module.exports = ProductRepository
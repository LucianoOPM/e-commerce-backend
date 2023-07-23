class ProductDaoMemory {
    constructor() {
        this.products = []
    }
    getProduct = () => {
        try {
            return this.products
        } catch (error) {
            return error
        }
    }

    getProductById = (CID) => {
        try {
            return this.products.find(product => CID === product.id)
        } catch (error) {
            return error
        }
    }

    updateProduct = (PID, changes) => {
        try {
        } catch (error) {
            return error
        }
    }
}

module.exports = ProductDaoMemory
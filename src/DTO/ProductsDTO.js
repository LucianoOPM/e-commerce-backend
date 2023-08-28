class ProductDto {
    static getProduct = product => {
        return {
            PID: product._id.toString(),
            title: product.title,
            description: product.description,
            owner: product.owner,
            price: product.price,
            thumbnails: product.thumbnail,
            code: product.code,
            stock: product.stock,
            status: product.status,
            category: product.category
        }
    }

    static getProducts = productArray => {
        return productArray.map(product => {
            return {
                PID: product.id,
                title: product.title,
                description: product.description,
                owner: product.owner,
                price: product.price,
                thumbnails: product.thumbnail,
                code: product.code,
                stock: product.stock,
                status: product.status,
                category: product.category
            }
        })
    }
}

module.exports = ProductDto
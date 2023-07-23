class ProductDto {
    constructor(product) {
        this.idProduct = product.id
        this.owner = product.owner
        this.title = product.title
        this.description = product.description
        this.price = product.price
        this.thumbnails = product.thumbnail
        this.code = product.code
        this.status = product.status
        this.stock = product.stock
        this.category = product.category
    }
}

module.exports = ProductDto
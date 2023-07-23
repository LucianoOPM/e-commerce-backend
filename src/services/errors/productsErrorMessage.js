const nullOrEmptyValues = ({ title, price, code, stock, category, description }) => {
    if (!title.trim()) return `Product needs a String type title but recived ${title} with ${typeof title} value`
    if (!price) return `Product needs a Number type for price but recived ${price} with ${typeof price} value`
    if (!code.trim()) return `Product needs a String type code but recived ${code} with ${typeof code} value`
    if (!stock) return `Product needs a Number type stock but recived ${stock} with ${typeof stock} value`
    if (!category.trim()) return `Product needs a String type category but recived ${category} with ${typeof category} value`
    if (!description.trim()) return `Product needs a String type description but recived ${description} with ${typeof description} value`
}

const repetedProductError = (newProduct) => `A product has been found with the same product code: ${newProduct.code}`

module.exports = {
    nullOrEmptyValues,
    repetedProductError
}
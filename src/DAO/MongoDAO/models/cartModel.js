const { Schema, model } = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const collection = 'carts'

const cartSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products'
        },
        qty: {
            type: Number,
            default: 1
        },
        _id: false
    }]
})

cartSchema.plugin(paginate)
const cartModel = model(collection, cartSchema)

module.exports = {
    cartModel
}
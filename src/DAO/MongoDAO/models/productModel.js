const { Schema, model } = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const collection = 'products'

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.String,
        ref: 'usuarios',
        default: 'ADMIN'
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: [String]
    },
    code: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    }
})

productSchema.plugin(paginate)
const productModel = model(collection, productSchema)

module.exports = {
    productModel
}
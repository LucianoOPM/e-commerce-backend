const { Schema, model } = require('mongoose')

const collection = 'messages'

const chatSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    messages: [{
        _id: false,
        date: { type: String },
        message: { type: String }
    }]
})

const messageModel = model(collection, chatSchema)

module.exports = {
    messageModel
}
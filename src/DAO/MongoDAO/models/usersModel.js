const { Schema, model } = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const collection = 'usuarios'

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    cartID: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    documents: [
        { name: String, reference: String, _id: false }
    ],
    role: {
        type: String,
        enum: ['user', 'ADMIN', 'premium'],
        default: 'user'
    },
    birthdate: {
        type: Date,
    },
    password: {
        type: String
    },
    last_connection: {
        type: String
    }
}, {
    versionKey: false
})

usersSchema.plugin(paginate)
const userModel = model(collection, usersSchema)

module.exports = {
    userModel
}

/*
[
    {
        uid: userID,
        first_name: nombre,
        last_name: apellido,
        email: email,
        cartID: asdasdsadasdasd213213,,
        document: [{name, reference}],
        last_connection: ""
        role: customer,
        birthDate: 08/05/1996,
        password:asdasda
    },
    {
        uid: userID,
        first_name: nombre,
        last_name: apellido,
        email: email,
        cartID: asdasdsadasdasd213213,
        role: customer,
        birthDate: 08/05/1996,
        password:asdasda
    }
]
*/
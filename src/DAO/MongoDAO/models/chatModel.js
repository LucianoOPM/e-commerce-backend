const { Schema, model } = require('mongoose')

const collection = 'messages'

const chatSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    message: [{
        _id: false,
        date: String,
        content: String
    }]
})

const messageModel = model(collection, chatSchema)

module.exports = {
    messageModel
}

/*

[
    {
        _id: mongoID,
        user: fulano,
        mensajes:[
            {
                fecha: 29-09-15,
                hora: 23:03:09,
                mensaje: "Hola a todos."
            }
        ]
    },
    {
        _id: MongoID2,
        user: fulano2,
        mensajes:[
            {
                fecha: 29-09-15,
                hora: 23:03:10,
                mensaje: "Hola fulano."
            }
        ]
    }
]

*/
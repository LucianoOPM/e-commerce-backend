const { isValidObjectId } = require("mongoose")

/**
 * Middleware que valida si el carrito del usuario mandada por los headers es el mismo que los params de la peticion
 * @param {Object} req Peticion del front
 * @param {Object} res Respuesta del servidor en caso de fallo en la peticion
 * @param {Function} next Función que permite el paso en caso de que la peticion sea exitosa
 * @returns {Object|void}
 */
const cartValidator = (req, res, next) => {
    const { user: { CID: CID_user }, params: { CID: CID_param } } = req

    if (!isValidObjectId(CID_param)) return res.status(400).send({
        status: "Bad Request",
        payload: "Cart ID param isn't a valid Object ID"
    })

    if (CID_user !== CID_param) return res.status(400).send({
        status: 'Bad Request',
        payload: "Cart ID doesn't match"
    })
    next()
}

module.exports = cartValidator
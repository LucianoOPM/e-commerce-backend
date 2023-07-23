const { authUrl } = require("../config/passportJWT")
const validateToken = (req, res, next) => {
    try {
        const { params: { token } } = req
        authUrl(token)
        next()
    } catch (error) {
        res.status(498).redirect('/restore')
    }
}

module.exports = validateToken
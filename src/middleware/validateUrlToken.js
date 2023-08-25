const { authUrl } = require("../config/passportJWT")
const validateToken = async (req, res, next) => {
    try {
        const { params: { token } } = req
        const information = authUrl(token)
        req.user = information
        next()
    } catch (error) {
        res.status(498).redirect('/restore')
    }
}

module.exports = validateToken
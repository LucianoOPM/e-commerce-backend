const passport = require('passport')

/**
 * 
 * @param {String} strategy Un string con la estrategia a seguir, 'jwt' o 'github'
 * @returns error si no cumple las validaciones || una propiedad "user" en el objeto req si cumple las validaciones
 */
const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err)
            const { email, name, password } = user

            if (!email) return res.status(401).send({ status: 'error', error: info.message ? info.message : info.toString() })

            req.user = { email, name, password }
            next()
        })(req, res, next)
    }
}

module.exports = passportCall
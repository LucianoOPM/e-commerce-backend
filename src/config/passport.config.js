const passport = require('passport')
const jwt = require('passport-jwt')
const gitStrategy = require('passport-github2')
const {
    SECRET_KEY,
    GITHUB_CALLBACK_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET } = require('./config')


const { ExtractJwt, Strategy } = jwt

const cookieExtractor = req => req?.cookies?.['coderCookieToken'] || null
/**
 * 
 * @param {Object<any>} req Request object that have headers on the request petition 
 * @returns 
 */
const tokenHeaderExtractor = req => {

    const token = req.headers.cookie ?? req.headers.authorization ?? null

    if (!token) return token

    if (token.toLowerCase().includes('bearer')) {
        return token.split(' ')[1]
    }
    return token.split('=')[1]

}

const initPassport = () => {

    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new gitStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            const { name, email } = profile._json
            const user = {
                name,
                email: email || "Email no definido",
                password: ""
            }

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('current', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([tokenHeaderExtractor]),
        secretOrKey: SECRET_KEY
    }, async (jwt_payload, done) => {
        try {
            done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = initPassport
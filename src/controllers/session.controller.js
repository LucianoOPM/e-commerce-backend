const { generateToken } = require("../config/passportJWT")
const { sessionService } = require('../services/index')

class SessionController {
    login = async (req, res) => {
        try {
            const bodyKeys = Object.keys(req.body)
            const { body: { email, password } } = req

            if (bodyKeys.length === 0) return res.status(400).sendServerError('Empty values')

            const user = await sessionService.login(email, password)
            const token = generateToken(user)

            res.status(200)
                .cookie('coderCookieToken', token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000
                })
                .sendSuccess({ message: "User logged successfully", token })
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    logout = async (req, res) => {
        try {
            const { UID } = req.user
            await sessionService.logout(UID)
            res
                .clearCookie('coderCookieToken')
                .redirect('/login')
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    github = async (req, res) => {
        try {
            const { email, name } = req.user
            const findUser = await sessionService.githubLogin(email, name)

            const token = generateToken(findUser)

            res.status(200).cookie('coderCookieToken', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            }).redirect('/products')
        } catch (error) {
            if (error) return error
        }
    }

    currentSession = async (req, res) => {
        try {
            const user = await sessionService.currentSession(req.user.email)
            res.status(200).sendSuccess(user)
        } catch (error) {
            return res.status(500).sendServerError(error.message)
        }
    }
}

module.exports = SessionController

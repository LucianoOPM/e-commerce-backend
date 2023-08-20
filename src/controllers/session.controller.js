const { generateToken } = require("../config/passportJWT")
const { userService, cartService } = require("../services")
const { isValidPass } = require("../utils/bcrypthash")

class SessionController {
    login = async (req, res) => {
        try {
            const bodyKeys = Object.keys(req.body)

            if (bodyKeys.length === 0) return res.status(400).sendServerError('Empty values')

            const user = await userService.findUser(req.body.email)
            if (!user) return res.status(400).sendServerError('User or password are wrong')

            const { password, nonSensitiveUser } = user

            const rightPass = await isValidPass(req.body.password, password)

            if (!rightPass) return res.status(400).sendServerError('User or password are wrong')

            const token = generateToken({ user: { first_name: nonSensitiveUser.first_name, last_name: nonSensitiveUser.last_name, userID: nonSensitiveUser.userID, role: nonSensitiveUser.role, cartID: nonSensitiveUser.cartID, email: nonSensitiveUser.email } })

            res.status(200)
                .cookie('coderCookieToken', token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000
                })
                .sendSuccess(`User logged success ${token}`)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    logout = async (req, res) => {
        try {
            const { userID } = req.user
            const last_connection = {
                last_connection: new Date().toLocaleString('es-MX')
            }
            const user = await userService.updateUser(userID, last_connection)
            res
                .clearCookie('coderCookieToken')
                .redirect('/login')
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    github = async (req, res) => {
        try {
            const findUser = await userService.findUser(req.user.email)

            if (!findUser) {//Si no encuentra el usuario
                const { _id: cartID } = await cartService.newCart()

                const newUser = {
                    first_name: req.user.name.split(' ')[0],
                    last_name: req.user.name.split(' ')[1],
                    email: req.user.email,
                    password: req.user.password,
                    cartID: cartID.toString()
                }//Separamos sus valores

                const { _id } = await userService.addUser(newUser)//Y lo guardamos en la base de datos
                const token = generateToken({ user: _id.toString() })//Generamos un token

                return res.status(200).cookie('coderCookieToken', token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000
                }).sendSuccess(`user created ${token}`)//Y accede con github
            }
            //Si encuentra el usuario
            const { nonSensitiveUser: { userID, cartID, role, email, first_name, last_name } } = findUser//Separamos sus datos
            const token = generateToken({ user: { userID, cartID, role, email, first_name, last_name } })
            return res.status(200).cookie('coderCookieToken', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            }).redirect('/products')//Generamos una cookie con sus datos no vulnerables.
        } catch (error) {
            if (error) return error
        }
    }

    currentSession = async (req, res) => {
        try {
            const { nonSensitiveUser: { first_name, last_name, userID, cartID, role, age } } = await userService.findUser(req.user.email)
            res.status(200).sendSuccess({
                user: {
                    first_name, last_name, userID, cartID, role, age
                }
            })
        } catch (error) {
            return res.status(500).sendServerError(error.message)
        }
    }
}

module.exports = SessionController

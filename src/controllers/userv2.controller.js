const { isValidObjectId } = require("mongoose");
const { signUrlToken } = require("../config/passportJWT");
const { userService } = require("../services");//instancia del manager de mongo
const sendMail = require('../utils/sendEmail.js');
const pageBuilder = require("../utils/pageBuilder");

class UserController {
    get = async (req, res, next) => {
        try {
            const { query: { sort = "asc", role, page = 1, limit = 10 } } = req
            const VALID_ROLES = ["user", "admin", "premium"]
            const VALID_SORT = ["-1", "1", "asc", "desc"]

            if (!VALID_SORT.includes(sort.toLowerCase())) {
                throw new Error('Sort value is not valid')
            }

            const searchQuery = []
            const options = {
                page: Number(page),
                limit: Number(limit),
                lean: true
            }
            if (role) {
                if (!VALID_ROLES.includes(role.toLowerCase())) {
                    throw new Error('Role is not a valid keyword')
                }
                role.toUpperCase() === "ADMIN" ? searchQuery.push({ role: role.toUpperCase() }) : searchQuery.push({ role: role.toLowerCase() })
            } else {
                searchQuery.push({})
            }
            if (!isNaN(sort)) {
                options["sort"] = { first_name: Number(sort) }
            } else {
                options["sort"] = { first_name: sort }
            }
            searchQuery.push(options)

            //Ejecuta la query
            const { normalizedUsers, pagination } = await userService.getUsers(searchQuery)
            const urls = pageBuilder(req, pagination)

            //Arroja el resultado a la paginación
            res.status(200).sendSuccess({ docs: normalizedUsers, pagination: urls })
        } catch (error) {
            next(error)
        }
    }

    getById = async (req, res, next) => {
        try {
            //Extrae el UID de los parametros de request
            const { UID } = req.params

            //Valida que el UID sea un ObjectID valido
            if (!isValidObjectId(UID)) throw new Error('UID is not an accepted ObjectID')

            //Efectua la busqueda por UID
            const user = await userService.findUser(UID)
            if (!user) return res.status(404).sendUserError("User not found")

            //Arroja el resultado
            res.status(200).sendSuccess(user)
        } catch (error) {
            next(error)
        }
    }

    post = async (req, res, next) => {
        try {
            //Extrae los valores del req.body
            const userInfo = req.body

            //Si faltan algunos de estos valores, retorna un error
            if (!userInfo.first_name || !userInfo.last_name || !userInfo.email || !userInfo.password || !userInfo.birthdate) throw new Error('Empty Values')

            const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegExp.test(userInfo.email)) throw new Error('email is not a valid value')
            //Si no faltan valores, efectua una busqueda por email para validar que el usuario no este registrado en la base de datos.
            const newUser = await userService.addUser(userInfo)

            //Entrega el token a la cookie "coderCookieToken" y le asigna la configuración
            res.status(200).sendSuccess({ message: 'User registered Successfully', newUser })
        } catch (error) {
            next(error)
        }
    }

    put = async (req, res, next) => {
        try {
            //Valores que se permitirán cambiar al usuario
            const acceptedBody = ["birthdate", "first_name", "last_name"]

            //Extrae el UID y el body del req
            const { params: { UID }, body } = req
            //extrae las key del req.body
            const bodyKeys = Object.keys(req.body)
            //Valida que las keys del req.body esten dentró de los keys permitidos
            const validBody = bodyKeys.some(keys => !acceptedBody.includes(keys))

            //validaciones
            if (!isValidObjectId(UID)) throw new Error("UID isn't a valid ObjectID")//Valida que el UID sea un objectID valido
            if (bodyKeys.length === 0) throw new Error('Empty request body keys')//Valida que no tenga un json vacio para las modificaciones
            if (validBody) throw new Error("Some keys doesn't match with allowed key user values")//Valida que las modificaciones implementadas sean validas.

            //Efectua los cambio y se extraen las propiedades que se utilizarán para generar el token (No extraer la constraseña o información sensible)
            const updatedUser = await userService.updateUser(UID, body)

            //Guarda el nuevo token generado en las cookies
            res.status(200).sendSuccess({ message: "User updated", updatedUser })
        } catch (error) {
            next(error)
        }
    }

    updateRol = async (req, res, next) => {
        try {
            const { params: { UID } } = req
            if (!isValidObjectId(UID)) {
                throw new Error('UID is not a valid object ID')
            }
            const user = await userService.findUser(UID)

            if (!user) {
                throw new Error("User doesn't exists")
            }

            if (user.documents.length < 3 && user.role === "user") {
                throw new Error('User must have all the documentation to be able to upgrade its account.')
            }

            user.role == "user" ? user.role = "premium" : user.role === "premium" ? user.role = "user" : null
            const newRole = await userService.updateUser(UID, user)

            res.status(200).sendSuccess(newRole)
        } catch (error) {
            next(error)
        }
    }

    delete = async (req, res, next) => {
        try {
            //extrae el UID de los params
            const { params: { UID } } = req

            //Valida que el UID sea un objectID válido
            if (!isValidObjectId(UID)) throw new Error('UID is not a valid ObjectId')
            const deleted = await userService.deleteUser(UID)

            res.status(200).sendSuccess({ message: "User deleted successfully", deleted })
        } catch (error) {
            next(error)
        }
    }

    deleteUsers = async (req, res, next) => {
        try {
            const { normalizedUsers } = await userService.getUsers({})
            const usersToDelete = normalizedUsers.filter((user) => {
                const splitedLast_Connection = user.last_connection.split(",")
                const last_connectionDate = splitedLast_Connection[0].split("/").reverse().join("-")
                const last_connection = last_connectionDate.concat(splitedLast_Connection[1])

                /*Para los días*/
                // const userLastConnectionDate = new Date(last_connection)
                // const days = 1000 * 60 * 60 * 24
                const userLastConnectionHour = new Date(last_connection)
                const actualHour = new Date()

                const minutes = 1000 * 60

                return parseInt((actualHour - userLastConnectionHour) / minutes) >= 30
            })

            const HTML = `<p>Your account was been deleted for inactivity</p>`

            usersToDelete.forEach(async user => {
                const { UID } = await userService.findUser(user.email)
                await userService.deleteUser(UID)
                sendMail(user.email, "inactivity", HTML)
            });

            res.status(200).sendSuccess('Users deleted')
        } catch (error) {
            next(error)
        }
    }

    restore = async (req, res, next) => {
        try {
            const { body: { email } } = req

            const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegExp.test(email)) throw new Error('email is not a valid value')

            const user = await userService.findUser(email)

            if (!user) {
                return res.status(404).sendUserError('Error changing password')
            }

            const token = signUrlToken(user)
            const URL = `http://localhost:8080/restore/${token}`

            const html = `
                <center>
                    <p>
                        Se ah solicitado un cambio de contraseña
                    </p>
                    <p>
                        Ingrese al siguiente enlace para cambiar su contraseña: <a>${URL}</a>
                        <h6>Este enlace tiene una fecha de expiración de 1hr</h6>
                    </p>
                    <p>
                        Si usted no mandó un correo para cambiar la contraseña, por favor envíe un email
                    </p>
                </center>
            `
            sendMail(email, "Change Password", html)
            res.status(200).sendSuccess("Mail enviado correctamente")
        } catch (error) {
            next(error)
        }
    }

    newPass = async (req, res, next) => {
        try {
            const { email } = req.user
            const { password } = req.body
            const changePassword = await userService.changePassword(email, password)

            if (!changePassword) {
                return res.status(404).sendUserError("Something gone wrong")
            }
            return res.status(200).send('password changed successfully')
        } catch (error) {
            next(error)
        }
    }

    document = async (req, res, next) => {
        try {
            const { params: { UID } } = req
            const user = await userService.findUser(UID)
            if (!user) throw new Error('User not found')

            const identify = req.files?.identify
            const address = req.files?.address
            const bankStatement = req.files?.bankStatement

            if (!identify && !address && !bankStatement) throw new Error('At least one document should be uploaded')

            const documents = []
            let response = "Next documents were uploaded successfully:"

            if (identify) {
                documents.push({ name: identify[0].filename, reference: identify[0].path })
                if (documents.length > 1) {
                    response = response.concat(", ", "Identify")
                } else {
                    response = response.concat(" ", "Identify")
                }
            }
            if (address) {
                documents.push({ name: address[0].filename, reference: address[0].path })
                if (documents.length > 1) {
                    response = response.concat(", ", "Address")
                } else {
                    response = response.concat(" ", "Address")
                }
            }
            if (bankStatement) {
                documents.push({ name: bankStatement[0].filename, reference: bankStatement[0].path })
                if (documents.length > 1) {
                    response = response.concat(", ", "Bank Statement")
                } else {
                    response = response.concat(" ", "Bank Statement")
                }
            }

            await userService.updateDocuments(UID, documents)
            res.status(202).sendSuccess(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController;
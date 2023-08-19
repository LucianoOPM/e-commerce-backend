const { isValidObjectId } = require("mongoose");
const { generateToken, signUrlToken } = require("../config/passportJWT");
const { userService, cartService } = require("../services");//instancia del manager de mongo
const { createHash, isValidPass } = require("../utils/bcrypthash");
const querySearch = require("../utils/querySearch");
const sendMail = require('../utils/sendEmail.js')

class UserController {
    get = async (req, res, next) => {
        try {
            //recuperamos las keys del objeto req.query
            const queryKeys = Object.keys(req.query)

            //Si el req.query viene vacio, ejecuta una consulta general
            if (queryKeys.length === 0) {
                const emptyQuery = querySearch(req.query, "users")
                const docs = await userService.getUsers(emptyQuery)
                return res.status(200).sendSuccess(docs)
            }

            //Si el req.query no viene vacio, busca que venga con las palabras permitidas
            const SEARCH_KEYS = ["role", "limit", "sort", "page"]
            const successQuery = queryKeys.some(keys => SEARCH_KEYS.includes(keys))
            if (!successQuery) throw new Error('Some keys missmatch with accepted search keys')

            //Si contiene las palabras permitidas, ejecuta la función para formar la query
            const searchQuery = querySearch(req.query, "users")

            //Ejecuta la query
            const searchUser = await userService.getUsers(searchQuery)

            //Arroja el resultado a la paginación
            res.status(200).sendSuccess(searchUser)
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
            res.status(200).sendSuccess(user.nonSensitiveUser)
        } catch (error) {
            next(error)
        }
    }

    post = async (req, res, next) => {
        try {
            //Extrae los valores del req.body
            const { first_name, last_name, email, password, birthdate } = req.body

            //Si faltan algunos de estos valores, retorna un error
            if (!first_name || !last_name || !email || !password || !birthdate) throw new Error('Empty Values')

            const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegExp.test(email)) throw new Error('email is not a valid value')
            //Si no faltan valores, efectua una busqueda por email para validar que el usuario no este registrado en la base de datos.
            const userExists = await userService.findUser(email)

            //Si está, ejecuta un error
            if (userExists) throw new Error('User Already Exists')

            //Si no está, genera un carrito nuevo y se le asigna al usuario.
            const { _id } = await cartService.newCart()

            //Guarda el usuario en la base de datos
            const registeredUser = await userService.addUser({
                first_name,
                last_name,
                email,
                cartID: _id,
                birthdate,
                password: await createHash(password),
                role: email == "adminCoder@coder.com" ? "ADMIN" : "user" //Validacion de que si el usuario registrado es "admin coder" se le asigna el rol de admin
            })

            //Genera un token
            const token = generateToken({ user: { userID: registeredUser.userID, role: registeredUser.role, cartID: registeredUser.cartID, email: registeredUser.email } })

            //Entrega el token a la cookie "coderCookieToken" y le asigna la configuración
            res.status(200).sendSuccess({ message: 'User registered Successfully', token })
        } catch (error) {
            next(error)
        }
    }

    put = async (req, res, next) => {
        try {
            //Valores que se permitirán cambiar al usuario
            const acceptedBody = ["first_name", "last_name", "birthdate"]

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
            const { cartID, role, email, userID } = await userService.updateUser(UID, body)

            //Genera el token

            const token = generateToken({ user: { cartID, role, email, userID } })

            //Guarda el nuevo token generado en las cookies
            res.status(200).cookie('coderCookieToken', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 100
            }).sendSuccess({ message: "User updated", token })
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
            const { nonSensitiveUser } = await userService.findUser(UID) ?? {}

            if (!nonSensitiveUser) {
                throw new Error("User doesn't exists")
            }

            if (nonSensitiveUser.documents.length < 3 && nonSensitiveUser.role === "user") {
                throw new Error('User must have all the documentation to be able to upgrade its account.')
            }

            nonSensitiveUser.role == "user" ? nonSensitiveUser.role = "premium" : nonSensitiveUser.role === "premium" ? nonSensitiveUser.role = "user" : null
            const newRole = await userService.updateUser(UID, nonSensitiveUser)

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
            const { nonSensitiveUser: { userID, cartID } } = await userService.findUser(UID)

            if (!userID) throw new Error('User has not found')

            //Elimina al usuario según el UID otorgado
            await cartService.deleteCart(cartID)
            await userService.deleteUser(userID)

            res.status(200).sendSuccess('User deleted successfully')
        } catch (error) {
            next(error)
        }
    }

    restore = async (req, res, next) => {
        try {
            const { body: { email } } = req

            const user = await userService.findUser(email)
            const userID = user?.nonSensitiveUser.userID

            if (!userID) throw new Error("Can't find the user")

            const token = signUrlToken({ userID })

            const URL = `http://localhost:8080/restore/${userID}/${token}`

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
            const { params: { UID }, body: { password } } = req
            const { nonSensitiveUser: { email }, password: hashedPassword } = await userService.findUser(UID)

            const validPassword = await isValidPass(password, hashedPassword)
            if (validPassword) throw new Error("Passwords are equal")

            const newPassword = await createHash(password)
            await userService.changePassword({ email, newPassword })

            res.status(200).sendSuccess('Se cambió la contraseña')
        } catch (error) {
            next(error)
        }
    }

    document = async (req, res, next) => {
        try {
            const { params: { UID } } = req
            const { nonSensitiveUser } = await userService.findUser(UID) ?? {}
            if (!nonSensitiveUser) throw new Error('User not found')

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
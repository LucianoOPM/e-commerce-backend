const bcrypt = require('bcrypt')

//Funcion para crear el hash
const createHash = async password => {
    try {
        const saltRounds = 10
        return await bcrypt.hash(password, saltRounds)
    } catch (error) {
        throw error
    }
}
//hash es el encargado de encriptar la contraseña
//genSaltSync es el encargado de generar todas las llaves que usará hashSync para encriptar la contraseña. El cual tiene un sistema de profundidad, entre más alto sea el valor numerico, mayor será la seguridad, pero también será más lenta de generar. 12 se considera ya un valor muy alto, generalmente se coloca 10

//Generar la funcion para comparar la clave hasheada y la contraseña del formulario.
const isValidPass = async (password, hashedPass) => {
    try {
        return await bcrypt.compare(password, hashedPass)
    } catch (error) {
        throw error
    }
}
//el párametro user lo extraemos de la base de datos, y el párametro pass, se obtiene del formulario extraido desde el frontEnd



module.exports = {
    isValidPass,
    createHash
}
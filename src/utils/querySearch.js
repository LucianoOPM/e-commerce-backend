/**
 * Función que recibe el req.query y una palabra clave para hacer una petición a la base de datos según la query otorgada por la URL
 * @param {Object<any>} querys Objeto que se obtiene desde la req.query para buscar según el valor otorgado
 * @param {String} controller Palabra clave para identificar quien llama a la función puede tener distintos valores
 * @returns {Array<Object>} Retorna un array con los valores correctos para hacer una consulta a la base de datos
 */
const querySearch = (querys, controller) => {

    /** @type {Array<String>} Guarda las claves del req.query en un array*/
    const queryKeys = Object.keys(querys)

    /** @type {Number | String} Almacena la forma de acomodo de la páginación, según si recibió un numero o la letras "asc/desc" */
    const sortValue = !querys["sort"] ? 1 : isNaN(querys["sort"]) ? querys["sort"] : Number(querys["sort"])

    //Dependiendo de lo que reciba el parametro controller, selecciona uno de estos valores para el sort
    const controllerSelector = {
        users: { first_name: sortValue },
        products: { price: sortValue }
    }

    //Si querys no contiene ninguna de las siguientes palabras, efectua una busqueda general de todo el archivo.
    if (!(queryKeys.includes('role') || queryKeys.includes('status') || queryKeys.includes('category'))) {
        return [{}, {
            sort: controllerSelector[controller]/*Valor por defecto */,
            page: Number(querys["page"]) || 1/* "valor por defecto" */,
            limit: Number(querys["limit"]) || 10/* "valor por defecto" */,
            lean: true
        }]
    }

    //Recupera la posición del array dónde se encuentre la key necesaria
    const index = queryKeys.findIndex(key => {
        if (key === "role") return key
        if (key === "status") return key
        if (key === "category") return key
    })

    //Menú de busqueda
    const querySelector = {
        /*users search*/
        role: querys["role"],
        /*products search*/
        status: querys["status"],
        category: querys["category"]
    }

    //Se retorna la consulta completa para el uso
    return [{ [queryKeys[index]]: querySelector[queryKeys[index]] }, {
        sort: controllerSelector[controller]/*Valor por defecto */,
        page: Number(querys["page"]) || 1/* "valor por defecto" */,
        limit: Number(querys["limit"]) || 10/* "valor por defecto" */,
        lean: true
    }]
}

module.exports = querySearch
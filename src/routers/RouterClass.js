const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

class RouterClass {
    constructor() {
        this.router = Router()//Anteriormente al comenzar el enrutado declarabamos una variable con la instanciación de la función Router, ahora como usaremos todo en una clase, directamente la instanciamos en el constructor como this.router
        this.init()//init será la inicialización de todo el enrutado, el que recibirá las peticiones y entregará las respuestas.
    }

    getRouter = () => {
        return this.router
    }

    /**
     * Method that allows verify if the user role and route policies match
     * @param {Array<String>} policies Array containing information about the accessibility of the route.
     * @returns {(Response | Request | void)} If the route is public, it won't return anything, allowing all users to access. If the headers of the request do not match the route permissions, it returns an error response on the route. If the route and permissions are correct, it returns a 'user' value in the request object.
     */
    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === 'PUBLIC') return next()
        //Si la ruta es publica, permite el acceso a toda las personas.

        const authHeader = req.headers.cookie ?? req.headers.authorization ?? null
        //Si la ruta no es publica, se extrae la autorización del header(creo que es del usuario.)

        if (!authHeader) return res.send({ status: 'error', error: 'Unauthorized' })

        let token;
        //extrae el bearer desde el header pasado por fetch/POST
        if (authHeader.toLowerCase().includes('bearer')) {
            token = authHeader.split(' ')[1]
        } else {
            token = authHeader.split('=')[1]
        }
        //authorization: 'BEARER asdasda21d3a3(token)'
        const { user: { userID, role, cartID, email } } = jwt.verify(token, SECRET_KEY)//la palabra secreta(en este caso "PalabraJWTSecreta", debería venir en una variable de entorno.)

        if (!policies.includes(role.toUpperCase())) return res.status(403).send({ status: 'error', payload: 'No permission' })
        //Si las politicas de la ruta no incluyen el rol que tiene el usuario, arroja que no tiene permisos de visitar la ruta.

        req.user = { userID, role, cartID, email }
        next()
    }

    //Otra ventaja de los custom router, es el manejo de respuestas personalizadas, ya sea para errores o para respuestas éxitosas. Primero creamos un método.

    generateCustomResponse = async (_req, res, next) => {
        try {
            res.sendSuccess = payload => res.send({ status: 'success', payload })
            res.sendServerError = error => res.send({ status: 'error', error })
            res.sendUserError = error => res.send({ status: 'error', error })
            next()
        } catch (error) {
            if (error) {
                return res.send(error.message)
            }
        }
    }

    init() { }//La función init se inicializa acá, pero aqui no se construye de este lado, si no que se construirá del lado de la clase "hijo"

    //Está función será la encargada de recibir y procesar todas las callbacks que se encuentren en la ruta, tales como los middlewares y la request, sin importar cuantos middlewares contenga, ya que para eso se le aplica el spread operator al método que recibe la request.
    applyCallbacks = (callbacksArray) => {
        //Cómo aplicamos un spread operator, la función recibe como argumentos un array de en este caso, callbacks es decir. De forma visual, nuestra función recibe lo siguiente: 
        /*
            [(req, res, next)=>{}, (req, res, next)=>{}, (req, res)=>{}]

            Los cuales son todos los middleware que se encuentran en la ruta antes de acceder a nuestro endpoint. Y al ser un array, habrá que recorrer ese array de callbacks para acceder a lo que querramos. Para esto utilizamos el método map.
        */
        //Ahora, como nuestro array de callbacks también puede contener muchos parametros como el req, res y el next, lo desglozamos para poder acceder a los parametros.
        return callbacksArray.map(cbIndividual => async (...params) => {
            try {
                await cbIndividual.apply(this, params)
            } catch (error) {
                params[1].status(500).send({
                    status: 'error',
                    error
                })
            }
        })
    }

    //Este sería ahora nuestra nueva función router.get, sólo que ahora estará personalizado y tendrá mejoras notables.
    get = async (path, policies, ...callbacks) => {
        try {
            this.router.get(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
        } catch (error) {
            if (error) return error.message
        }
    }
    post = async (path, policies, ...callbacks) => {
        try {
            this.router.post(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
        } catch (error) {
            if (error) return error.message
        }
    }
    put = async (path, policies, ...callbacks) => {
        try {
            this.router.put(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
        } catch (error) {
            if (error) return error.message
        }
    }
    delete = async (path, policies, ...callbacks) => {
        try {
            this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
        } catch (error) {
            return error.message
        }
    }
}

module.exports = RouterClass
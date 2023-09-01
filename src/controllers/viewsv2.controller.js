const { productService, cartService, userService } = require("../services")
const pageBuilder = require("../utils/pageBuilder")
const pagination = require("../utils/pageBuilder")
const querySearch = require("../utils/querySearch")

class ViewsController {

    home = async (req, res, next) => {
        try {
            const canUpload = req.user?.role === "ADMIN" || req.user?.role === "premium"
            const isAdmin = req.user?.role === "ADMIN"
            const logged = req.hasOwnProperty("user")
            const renderObject = {
                style: "home.css",
                canUpload,
                isAdmin,
                logged,
                script: "home.js"
            }
            res.render('home', renderObject)
        } catch (error) {
            next(error)
        }
    }
    products = async (req, res) => {
        try {
            const queryBuild = querySearch(req.query, "products")
            const { products, pagination: pages } = await productService.paginate(queryBuild)
            const { prevLink, nextLink } = pagination(req, pages)

            const user = req?.user ?? null

            const productsRender = {
                logged: user ? false : true,
                title: "E-Commerce",
                products,
                style: "products.css",
                nextLink,
                prevLink,
                script: "viewProducts.js",
                role: user?.role ?? 'Invitado',
                addProducts: user?.role == 'ADMIN' || user?.role == 'premium' ? true : false,
                first_name: user?.first_name,
                last_name: user?.last_name,
                cartID: user?.CID
            }

            res.status(200).render('products', productsRender)
        } catch (error) {
            res.sendServerError(error.message)
        }
    }

    productsById = async (req, res) => {
        try {
            const { PID } = req.params
            const product = await productService.getById(PID)
            const user = req?.user ?? null

            const productView = {
                logged: user ? false : true,
                role: user?.role ?? 'Invitado',
                addProducts: user?.role === 'ADMIN' ? true : false,
                first_name: user?.first_name,
                last_name: user?.last_name,
                cartID: user?.CID,
                title: "E-Commerce",
                product,
                style: "product.css",
                script: "viewProducts.js"
            }

            res.status(200).render('productViews', productView)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    login = async (req, res) => {
        try {
            /*Si ya está logueado redirigir a products o home*/
            const loginView = {
                title: "Iniciar sesion",
                style: "login.css",
                script: "login.js"
            }
            res.status(200).render('login', loginView)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    register = async (req, res) => {
        try {
            const registerView = {
                title: "Register",
                style: "register.css",
                script: "register.js"
            }
            res.status(200).render("register", registerView)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    restore = (req, res) => {
        try {
            const restoreView = {
                title: "Restore Password",
                style: "restore.css",
                script: "restore.js"
            }
            res.status(200).render('restore', restoreView)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    newPassword = async (req, res) => {
        try {
            const newPassView = {
                title: "New Password",
                style: "new_pass.css",
                script: 'new_pass.js'
            }
            res.status(200).render('new_password', newPassView)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    realtimeproducts = async (req, res) => {
        try {
            const realTimeRender = {
                title: "Agregar Nuevos Productos",
                style: "realTimeProducts.css",
                script: "main.js",
            }
            res.status(200).render('realtimeproducts', realTimeRender)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    chat = async (req, res) => {
        try {
            const rend = {
                title: "Contacto",
                script: "chat.js",
                style: "chat.css"
            }

            res.status(200).render('chat', rend)
        } catch (error) {
            return res.status(500).sendServerError(error.message)
        }
    }

    userCart = async (req, res) => {
        try {
            const { cid } = req.params
            const { products, qty } = await cartService.get(cid)

            const costoTotal = products.map(item => item.product.price * item.qty).reduce((acc, curr) => acc + curr, 0)

            const cartRender = {
                emptyCart: products.length < 1 ? true : false,
                products,
                qty,
                total: costoTotal,
                style: "normalize.css",
                title: `Cart ${cid}`,
                cartID: `${cid}`,
                script: "cartPurchase.js"
            }

            res.status(200).render('cartView', cartRender)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    adminPanel = async (req, res, next) => {
        try {
            const { normalizedUsers, pagination } = await userService.getUsers()
            const pages = pageBuilder(req, pagination)

            normalizedUsers.map(user => user.documents = user.documents.join(" / "))

            const render = {
                normalizedUsers,
                pages,
                style: "adminpanel.css",
                script: "adminpanel.js"
            }
            res.status(200).render("adminpanel", render)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ViewsController
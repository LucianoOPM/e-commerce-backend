const { isValidObjectId } = require("mongoose");
const { productService, userService } = require("../services");
const querySearch = require("../utils/querySearch");
const pageBuilder = require("../utils/pageBuilder");
const fileUrl = require("../utils/fileUrl");
const CustomErrors = require("../services/errors/CustomErrors");
const productEnumError = require("../services/errors/enumError");
const { nullOrEmptyValues, repetedProductError } = require("../services/errors/productsErrorMessage");
const logger = require('../config/logger.js');
const sendMail = require("../utils/sendEmail");

class ProductController {
    get = async (req, res) => {
        try {
            const queryKeys = Object.keys(req.query)

            if (queryKeys.length < 1) {
                const emptyQuery = querySearch(req.query, "products")
                const { products, pagination } = await productService.paginate(emptyQuery)
                const pageBuild = pageBuilder(req, pagination)
                return res.status(200).sendSuccess({ products, pageBuild })
            }

            const SEARCH_KEYS = ["sort", "limit", "page", "category", "status"]
            const successKeys = queryKeys.some(keys => SEARCH_KEYS.includes(keys))

            if (!successKeys) throw new Error('Some keys missmatch with accepted search keys')

            const searchQuery = querySearch(req.query, "products")

            const { products, pagination } = await productService.paginate(searchQuery)


            const pageBuild = pageBuilder(req, pagination)
            res.status(200).sendSuccess({ products, pageBuild })
        } catch (error) {
            logger.error(error)
            res.status(400).sendServerError(error.message)
        }
    }

    getById = async (req, res) => {
        try {
            const { pid } = req.params
            if (!isValidObjectId(pid)) throw new Error('Invalid product ID')

            const product = await productService.getById(pid)
            res.status(200).sendSuccess(product)
        } catch (error) {
            logger.error(error)
            res.status(400).sendServerError(error.message)
        }
    }

    post = async (req, res, next) => {
        try {
            let { body: { title, description, price, code, stock, category }, user: { UID } } = req

            if (!title.trim() || !price || !code || !stock || !category || !description) {
                CustomErrors.productError({
                    name: "Product Creation Error",
                    code: productEnumError.UNDEFINED_OR_NULL_VALUES,
                    cause: nullOrEmptyValues(req.body),
                    message: 'Error trying to create a new product.'
                })
            }
            const findProduct = await productService.getByCode(code)
            if (findProduct) {
                CustomErrors.productError({
                    name: 'Product Creation Error',
                    code: productEnumError.REPETED_PRODUCT,
                    cause: repetedProductError(req.body),
                    message: 'Error trying to create a new product.'
                })
            }

            const fileLocation = req.file ? fileUrl(req.file) : null
            const status = req.body.status == 'true' || req.body.status == true

            const newProduct = {
                title,
                description,
                price: Number(price),
                code,
                stock: Number(stock),
                category,
                status,
                thumbnail: fileLocation ? [fileLocation] : [],
                owner: UID
            }
            const addProduct = await productService.create(newProduct)

            res.status(200).sendSuccess({ message: 'Product created', addProduct })
        } catch (error) {
            next(error)
        }
    }

    update = async (req, res, next) => {
        try {
            const { params: { pid }, user: { userID, role } } = req

            if (!isValidObjectId(pid)) throw new Error("Param isn't an valid ID")
            if (Object.keys(req.body).length < 1) throw new Error("There's empty values to update")

            const product = await productService.getById(pid)
            if (!product) {
                CustomErrors.productError({
                    name: "Can't update product",
                    code: productEnumError.UNDEFINED_OR_NULL_VALUES,
                    cause: nullOrEmptyValues(product),
                    message: "Can't modify product because product doesn't exists"
                })
            }

            if (role.toLowerCase() !== 'admin') {
                if (product.owner.toString() !== userID) {
                    throw new Error("Can't modify this product")
                }
                const updateProduct = await productService.update(pid, req.body)
                return res.status(200).sendSuccess({
                    updateProduct,
                    message: 'Product has been updated'
                })
            }

            const updateProduct = await productService.update(pid, req.body)

            res.status(200).sendSuccess({
                updateProduct,
                message: 'Product update success'
            })
        } catch (error) {
            next(error)
        }
    }

    delete = async (req, res) => {
        try {
            const { params: { pid }, user: { userID, role } } = req
            if (!isValidObjectId(pid)) throw new Error("Product ID isn't a correct value")

            const findProduct = await productService.getById(pid)
            if (!findProduct) throw new Error('Product missmatch')

            if (role.toLowerCase() !== 'admin') {
                if (findProduct.owner !== userID) {
                    throw new Error("No permissions")
                }
                const deleteProduct = await productService.delete(pid)
                return res.status(200).sendSuccess({
                    deleteProduct,
                    message: 'Product has been deleted'
                })
            }

            if (findProduct.owner !== "ADMIN") {
                const { email, role: ownerProductRole } = await userService.findUser(findProduct.owner)
                if (ownerProductRole === "premium") {
                    const HTML = `<p>Su producto ${findProduct.title} con el ID ${findProduct.PID} ah sido eliminado.</p>`
                    sendMail(email, "producto eliminado", HTML)
                }
            }

            const deleteProduct = await productService.delete(pid)
            res.status(200).sendSuccess({
                deleteProduct,
                message: 'Product deleted successfully'
            })
        } catch (error) {
            logger.error(error)
            res.status(500).sendServerError(error.message)
        }
    }
}


module.exports = ProductController
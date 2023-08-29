const multer = require('multer')
const path = require("path")
const createFolder = require('../utils/createUserFolder')


const DOCUMENTS = ["identify", "address", "bankStatement"]
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const { UID } = req.user

        if (DOCUMENTS.includes(file.fieldname)) {
            const parentFolder = path.join(__dirname, "..", "documents")
            const refPath = `${parentFolder}/${UID}`
            await createFolder(refPath)
            cb(null, refPath)
        }
        if (file.fieldname == "profile") {
            const parentFolder = path.join(__dirname, "..", "public/assets")
            const refPath = `${parentFolder}/profiles/${UID}`
            await createFolder(refPath)
            cb(null, `${parentFolder}/profiles/${UID}`)
        }
        if (file.fieldname == "product") {
            const parentFolder = path.join(__dirname, "..", "public/assets")
            const refPath = `${parentFolder}/products/${UID}`
            await createFolder(refPath)
            cb(null, `${parentFolder}/products/${UID}`)
        }
    },
    filename: function (req, file, cb) {
        if (DOCUMENTS.includes(file.fieldname)) {
            cb(null, `${file.fieldname} - ${Date.now()} - ${file.originalname}`)
        }
        if (file.fieldname == "profile") {
            cb(null, `${Date.now()} - ${file.originalname}`)
        }
        if (file.fieldname === "product") {
            cb(null, `${Date.now()} - ${file.originalname}`)
        }
    }
})

const validateFile = (req, file, cb) => {
    try {
        const VALIDATE_EXTENSIONS = ["png", "pdf", "jpg", "jpeg", "docx"]

        if (VALIDATE_EXTENSIONS.includes(file.mimetype.split('/')[1])) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    } catch (error) {
        cb(new Error(error))
    }
}

const uploader = multer({ storage, fileFilter: validateFile })

module.exports = uploader
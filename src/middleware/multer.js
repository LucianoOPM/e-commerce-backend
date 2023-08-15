const multer = require('multer')
const path = require("node:path")
const parentFolder = path.join(__dirname, "..", "public/assets")

const storage = multer.diskStorage({
    destination: function (_req, file, cb) {
        if (file.fieldname == "document") {
            cb(null, `${parentFolder}/documents`)
        }
        if (file.fieldname == "profile") {
            cb(null, `${parentFolder}/profiles`)
        }
        if (file.fieldname == "product") {
            cb(null, `${parentFolder}/products`)
        }
    },
    filename: function (_req, file, cb) {
        cb(null, `${Date.now()} - ${file.originalname}`)
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
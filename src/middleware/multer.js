const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, `../practicaIntegradora/src/public/assets/img`)
    },
    filename: function (_req, file, cb) {
        cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const uploader = multer({ storage })

module.exports = uploader
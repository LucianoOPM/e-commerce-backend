const UserController = require("../controllers/userv2.controller");
const uploader = require("../middleware/multer");
const validateToken = require("../middleware/validateUrlToken");
const RouterClass = require("./RouterClass");

const user = new UserController()

class UsersRouter extends RouterClass {
    init() {
        this.get('/', ['ADMIN'], user.get)//Funciona
        this.post('/', ['PUBLIC'], user.post)//Funciona
        this.get('/:UID', ['PUBLIC'], user.getById)//Funciona
        this.put('/:UID', ['PUBLIC'], user.put)//Funciona
        this.delete('/', ['ADMIN'], user.deleteUsers)//funciona
        this.delete('/:UID', ['ADMIN'], user.delete)//Funciona
        this.post('/:UID/documents', ['USER', 'PREMIUM', 'ADMIN'], uploader.fields([{ name: "identify", maxCount: 1 }, { name: "address", maxCount: 1 }, { name: "bankStatement", maxCount: 1 }]), user.document)
        this.post('/restore', ['PUBLIC'], user.restore)
        this.put('/restore/:token', ['PUBLIC'], validateToken, user.newPass)
        this.put('/premium/:UID', ['ADMIN'], user.updateRol)
    }
}
module.exports = UsersRouter
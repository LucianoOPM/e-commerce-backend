const UserController = require("../controllers/userv2.controller");
const uploader = require("../middleware/multer");
const RouterClass = require("./RouterClass");

const user = new UserController()

class UsersRouter extends RouterClass {
    init() {
        this.get('/', ['PUBLIC'], user.get)//Funciona
        this.post('/', ['PUBLIC'], user.post)//Funciona
        this.get('/:UID', ['PUBLIC'], user.getById)//Funciona
        this.put('/:UID', ['PUBLIC'], user.put)//Funciona
        this.delete('/:UID', ['ADMIN'], user.delete)//Funciona
        this.post('/:UID/documents', ['USER', 'PREMIUM', 'ADMIN'], uploader.fields([{ name: "identify", maxCount: 1 }, { name: "address", maxCount: 1 }, { name: "bankStatement", maxCount: 1 }]), user.document)
        this.post('/restore', ['PUBLIC'], user.restore)
        this.put('/restore/:UID', ['PUBLIC'], user.newPass)
        this.put('/premium/:UID', ['ADMIN'], user.updateRol)
    }
}
module.exports = UsersRouter
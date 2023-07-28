const UserController = require("../controllers/userv2.controller");
const RouterClass = require("./RouterClass");

const user = new UserController()

class UsersRouter extends RouterClass {
    init() {
        this.get('/', ['PUBLIC'], user.get)//Funciona
        this.post('/', ['PUBLIC'], user.post)//Funciona
        this.get('/:UID', ['PUBLIC'], user.getById)//Funciona
        this.put('/:UID', ['PUBLIC'], user.put)//Funciona
        this.delete('/:UID', ['ADMIN'], user.delete)//Funciona
        this.post('/restore', ['PUBLIC'], user.restore)
        this.put('/restore/:UID', ['PUBLIC'], user.newPass)
        this.put('/premium/:UID', ['ADMIN'], user.updateRol)
    }
}
module.exports = UsersRouter
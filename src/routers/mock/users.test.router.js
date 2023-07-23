const UserMockController = require("../../controllers/mock/user.test.controller");
const RouterClass = require("../RouterClass");

const mockingusers = new UserMockController()

class MockingUsers extends RouterClass {
    init() {
        this.get('/', ['PUBLIC'], mockingusers.getUsers)
    }
}

module.exports = MockingUsers
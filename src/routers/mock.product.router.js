const MockingController = require("../controllers/mock.controller");
const RouterClass = require("./RouterClass");
const mocking = new MockingController()

class MockingProductsRouter extends RouterClass {
    init() {
        this.get('/', ['PUBLIC'], mocking.getProducts)
        this.get('/simple', ['PUBLIC'], mocking.simple)
        this.get('/compleja', ['PUBLIC'], mocking.compleja)
    }
}

module.exports = MockingProductsRouter
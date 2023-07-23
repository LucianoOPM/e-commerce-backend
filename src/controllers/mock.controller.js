const { productGenerator } = require("../utils/productMockGenerator")

class MockingController {
    getProducts = (_req, res) => {
        try {
            const products = []

            for (let i = 0; i < 100; i++) {
                products.push(productGenerator())
            }

            res.status(200).sendSuccess(products)
        } catch (error) {
            res.status(500).sendServerError(error.message)
        }
    }

    simple = (req, res) => {
        let suma = 0
        for (let i = 0; i < 1000000; i++) {
            suma += i
        }
        res.send({ status: 'success', message: `El worker ${process.id} a atendido esta petición, el resultado es: ${suma}` })
    }

    compleja = (req, res) => {
        let suma = 0;
        for (let i = 0; i < 5e8; i++) {
            suma += i
        }
        res.send({ status: 'success', message: `El worker ${process.id} a atendido esta petición, el resultado es: ${suma}` })
    }
}

module.exports = MockingController
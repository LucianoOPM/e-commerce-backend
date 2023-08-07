const chai = require('chai')
const superTest = require('supertest')

const expect = chai.expect
const requester = superTest('http://localhost:8080')

describe('POST /api/products', () => {
    let cookie, idProduct, productOriginalPrice;
    beforeEach(async () => {
        const login = {
            email: "adminCoder@coder.com",
            password: "facil123"//password de la cuenta
        }
        let { headers } = await requester.post('/api/session/login').send(login)
        const cookieHeader = headers['set-cookie'][0]
        cookie = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1].split(';')[0]
        }
    })
    it('Router should create a new product with an image', async () => {
        const { _body } = await requester.post('/api/products')
            .field("title", "Test-Product")
            .field('description', "Test-product")
            .attach('thumbnail', './test/images_test/placeholder_image.png')
            .field('price', 9999)
            .field("stock", 9999)
            .field("code", "test")
            .field("status", true)
            .field("category", "test")
            .set('Cookie', [`${cookie.name}=${cookie.value}`])

        expect(_body).to.have.property('payload')//Que contenga la propiedad payload
        expect(_body.payload.addProduct).to.have.property('_id')//Que contrnga la propiedad _id
        expect(_body.payload.addProduct).to.have.property('owner')//Que contenga la propiedad owner
        idProduct = _body?.payload?.addProduct['_id']//Guarda el id en la variable idProduct
        productOriginalPrice = _body?.payload?.addProduct.price//Guarda el precio original del producto en la variable
    })
    it('Router should update the price of the product created', async () => {
        const newPrice = {
            price: 1500
        }
        const { _body } = await requester.put(`/api/products/${idProduct}`)
            .send(newPrice)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Cookie', [`${cookie.name}=${cookie.value}`])

        expect(_body.payload.updateProduct.price).to.be.equal(newPrice.price)//Que el precio sea igual al nuevo precio
        expect(_body.payload.updateProduct.price).to.be.not.equal(productOriginalPrice)//Que el precio sea diferente al precio original
        expect(_body.payload.updateProduct._id).to.be.equal(idProduct)//Que el id del producto sea el mismo
    })
    it('Router should get the product and verify if contains an image', async () => {
        const { _body } = await requester.get(`/api/products/${idProduct}`)
        expect(_body.payload.thumbnail).to.be.ok//Validar que el producto tenga una imagen
        expect(_body.payload).to.have.property('_id')//Validar que el objeto tenga la propiedad _id
    })
    after(async () => {
        const deleted = await requester.delete(`/api/products/${idProduct}`).set('Cookie', [`${cookie.name}=${cookie.value}`])
    })
})
const chai = require('chai')
const superTest = require('supertest')

const expect = chai.expect
const requester = superTest('http://localhost:8080')

describe('/api/carts Router test', () => {
    let cartID, cookie;
    beforeEach(async () => {
        const user = {
            email: 'adminCoder@coder.com',
            password: 'facil123'
        }
        let { header } = await requester.post('/api/session/login').send(user)
        const [cookieHeader] = header['set-cookie']
        cookie = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1].split(';')[0]
        }
        let { _body } = await requester.get(`/api/session/current`).set('Cookie', [`${cookie.name}=${cookie.value}`])
        cartID = _body.payload.user.cartID
    })
    it('Router should allow add into a cart an array of products', async () => {
        const productsMock = [
            { product: "64d131c9ffa80a9c5bddcb02", quantity: 1 },
            { product: "64d13322ffa80a9c5bddcb07", quantity: 1 },
            { product: "64d13412ffa80a9c5bddcb1b", quantity: 2 }
        ]

        let { _body } = await requester.put(`/api/carts/${cartID}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
            .send(productsMock)

        expect(_body.payload).to.have.property('products')
        expect(_body.payload.products).to.have.length(3)
    })
    it('Router should delete a product', async () => {
        const productID = "64d13412ffa80a9c5bddcb1b"

        const { _body } = await requester.delete(`/api/carts/${cartID}/product/${productID}`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])

        expect(_body.payload._id).to.be.equal(cartID)
        expect(_body.payload.products).to.have.length(2)
    })
    it("Router should be able to buy products inside, instead they aren't available", async () => {
        const { _body } = await requester.post(`/api/carts/${cartID}/purchase`)
            .set('Cookie', [`${cookie.name}=${cookie.value}`])
        const { _body: bodyCart } = await requester.get(`/api/carts/${cartID}`)

        expect(bodyCart.payload.products).to.have.length(0)
        expect(_body.payload).to.have.property('purchaser')
    })
})
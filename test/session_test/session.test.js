const chai = require('chai')
const superTest = require('supertest')

const expect = chai.expect
const requester = superTest('http://localhost:8080')

describe('Router Session test', () => {
    let userToken;
    it('User can login', async () => {
        const userCredentials = {
            email: 'adminCoder@coder.com',
            password: 'facil123'
        }
        const { _body, headers } = await requester.post('/api/session/login').send(userCredentials)

        expect(_body).to.have.property('payload')
        expect(headers).to.have.property('set-cookie')

        const cookie = headers['set-cookie'][0]
        userToken = {
            name: cookie.split('=')[0],
            value: cookie.split('=')[1].split(';')[0]
        }
    })
    it('Router should show current user information', async () => {
        const { _body } = await requester.get(`/api/session/current`).set('Cookie', [`${userToken.name}=${userToken.value}`])

        expect(_body.payload.user).to.have.property('userID')
    })
    it('Router will logout from current session', async () => {
        const { headers } = await requester.post('/api/session/logout').set('Cookie', [`${userToken.name}=${userToken.value}`])
        const cookieHeader = headers['set-cookie'][0]

        const cookie = cookieHeader.split('=')
        expect(cookie.includes(userToken.value)).to.be.not.ok
    })
})
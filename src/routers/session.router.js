const SessionController = require("../controllers/session.controller");
const passportCall = require("../middleware/passport.call");
const RouterClass = require("./RouterClass");

const session = new SessionController()

class SessionRouter extends RouterClass {
    init() {
        this.post('/login', ['PUBLIC'], session.login)
        this.post('/logout', ['USER', 'ADMIN', 'PREMIUM'], session.logout)
        this.get('/github', ['PUBLIC'], passportCall('github', { scope: ['user: email'] }))//Arreglar mañana
        this.get('/githubcallback', ['PUBLIC'], passportCall('github', {
            failureRedirect: '/login'
        }), session.github)
        this.get('/current', ['USER', 'ADMIN', 'PREMIUM'], session.currentSession)
    }
}

module.exports = SessionRouter
//login
//logout
//github
/*cuando vienen de headers --> authToken y cuando vienen de cookies--> passportCall('jwt'),*/
const { createTransport } = require('nodemailer')
const { MAILER_USER_GMAIL, MAILER_USER_PASS } = require('./config')

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: MAILER_USER_GMAIL,
        pass: MAILER_USER_PASS
    }
})

module.exports = transport
const { MAILER_USER_GMAIL } = require("../config/config");
const transport = require("../config/mailer.config");
const logger = require('../config/logger.js')

const sendMail = async (destiny, subject, html) => {
    try {
        return await transport.sendMail({
            from: MAILER_USER_GMAIL,
            to: destiny,
            subject,
            html,
            attachments: []
        })
    } catch (error) {
        logger.error(error.message)
    }
}

module.exports = sendMail
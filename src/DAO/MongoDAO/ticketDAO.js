const ticketModel = require("./models/ticketModel")

class TicketDao {
    newTicket = async (ticket) => {
        try {
            return await ticketModel.create(ticket)
        } catch (error) {
            throw error
        }
    }
}

module.exports = TicketDao
class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }
    newTicket = async (code, total, userEmail) => {
        try {
            return await this.dao.newTicket({ code, amount: total, purchaser: userEmail })
        } catch (error) {
            throw error
        }

    }
}

module.exports = TicketRepository
const Ticket = require('./Ticket')

/**
 * A class representing the collection of tickets in the HelpDesk system.
 *
 * @class
 */
class Tickets {
  #ticketsFull
  #tickets

  /**
   * Constructs a new Tickets object with an array of tickets.
   * @param {Array.<Ticket>} [ticketsFull] - The array of tickets.
   */
  constructor(ticketsFull = []) {
    this.#ticketsFull = ticketsFull
    this.#tickets = this.getTickets()
  }

  get tickets() {
    return this.#tickets
  }

  /**
   * Adds a new ticket to the collection.
   * @param {Object} tickets - The ticket.
   */
  addTicket(options) {
    const ticket = new Ticket(options)

    this.#ticketsFull.push(ticket)
    this.#tickets.push(this.getShortTicket(ticket))
  }

  /**
   * Deletes a ticket with a given id from the collection.
   * @param {string} id - The id of the ticket to delete.
   */
  deleteTicket(id) {
    this.#ticketsFull = this.#deleteTicket(id, this.#ticketsFull)
    this.#tickets = this.#deleteTicket(id, this.#tickets)
  }

  /**
   * Deletes a ticket with a given id from the array.
   * @param {string} id - The id of the ticket to delete.
   * @param {Array.<Ticket>} tickets - The array of tickets.
   * @returns {Array.<Ticket>} The array of tickets without the deleted ticket.
   */
  #deleteTicket(id, tickets) {
    return tickets.filter((ticket) => ticket.id !== id)
  }

  /**
   * Finds a ticket with a given id.
   * @param {string} id - The id of the ticket.
   * @returns {Ticket} The ticket with a given id or undefined.
   */
  getTicket(id) {
    return this.#ticketsFull.find((ticket) => ticket.id === id)
  }

  /**
   * Returns an array of short tickets.
   * @returns {Array.<Object>} The array of short tickets.
   */
  getTickets() {
    return this.#ticketsFull.map((ticket) => this.getShortTicket(ticket))
  }

  /**
   * Returns a short version of a ticket.
   * @param {Ticket} ticket - The ticket.
   * @returns {Object} The short version of the ticket.
   */
  getShortTicket(ticket) {
    // eslint-disable-next-line no-unused-vars
    const { _, ...ticketShort } = ticket
    return ticketShort
  }
}

module.exports = Tickets

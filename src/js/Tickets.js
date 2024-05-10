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
    this.#tickets = this.#getTickets()
  }

  get tickets() {
    return this.#tickets
  }

  /**
   * Adds a new ticket to the collection.
   * @param {Object} tickets - The ticket.
   */
  #addTicket(options) {
    const ticket = new Ticket(options)

    this.#ticketsFull.push(ticket)
    this.#tickets.push(this.#getShortTicket(ticket))
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
  getTicketFull(id) {
    return this.#ticketsFull.find((ticket) => ticket.id === id)
  }

  /**
   * Returns an array of short tickets.
   * @returns {Array.<Object>} The array of short tickets.
   */
  #getTickets() {
    return this.#ticketsFull.map((ticket) => this.#getShortTicket(ticket))
  }

  /**
   * Returns a short version of a ticket.
   * @param {Ticket} ticket - The ticket.
   * @returns {Object} The short version of the ticket.
   */
  #getShortTicket(ticket) {
    // eslint-disable-next-line no-unused-vars
    const { description, ...ticketShort } = ticket
    return ticketShort
  }

  /**
   * Returns an array of tickets.
   * @param {Object} ctx - The koa context.
   */
  getTickets = async (ctx) => {
    ctx.body = JSON.stringify(this.tickets)
    this.#setStatusResponseSuccess(ctx, 200, 'Tickets received')
  }

  /**
   * Creates a new ticket with the given name and description.
   * @param {Object} ctx - The koa context.
   * @param {string} ctx.request.body.name - The name of the ticket.
   * @param {string} ctx.request.body.description - The description of the ticket.
   */
  createTicket = async (ctx) => {
    const { method, name, description } = ctx.request.body

    if (method !== 'createTicket') {
      this.#setStatusResponseError(ctx, 400, 'Wrong method')
      return
    }

    if (!name || !description) {
      this.#setStatusResponseError(ctx, 400, 'Name and description are required')
      return
    }

    this.#addTicket({ name, description })
    ctx.body = JSON.stringify(this.tickets)
    this.#setStatusResponseSuccess(ctx, 201, 'Ticket created')
  }

  /**
   * Updates a ticket with the given id and properties.
   * @param {Object} ctx - The koa context.
   * @param {string} ctx.request.body.id - The id of the ticket.
   * @param {string} ctx.request.body.name - The name of the ticket.
   * @param {string} ctx.request.body.description - The description of the ticket.
   */
  updateTicket = async (ctx) => {
    const { id, ...props } = JSON.parse(ctx.request.body)

    if (!id) {
      this.#setStatusResponseError(ctx, 400, 'Id is required')
      return
    }

    this.#updateTickets(id, props)

    this.#setStatusResponseSuccess(ctx, 200, 'Ticket updated')
  }

  /**
   * Updates a ticket with the given id and properties.
   * @param {string} id - The id of the ticket.
   * @param {Object} props - The properties to update.
   */
  #updateTickets(id, props) {
    this.#ticketsFull = this.#updateTicket(id, props, this.#ticketsFull)
    this.#tickets = this.#updateTicket(id, props, this.#tickets)
  }

  /**
   * Updates a ticket with the given id and properties.
   * @param {string} id - The id of the ticket.
   * @param {Object} props - The properties to update.
   * @param {Array.<Ticket>} tickets - The array of tickets.
   * @returns {Array.<Ticket>} The array of tickets with the updated ticket.
   */
  #updateTicket(id, props, tickets) {
    return tickets.map((ticket) => (ticket.id === id ? { ...ticket, ...props } : ticket))
  }

  /**
   * Sets the status code and the body of the response.
   * @param {Object} ctx - The koa context.
   * @param {string} message - The message to send.
   */
  #setStatusResponseError(ctx, status, message) {
    ctx.status = status
    ctx.body = message
  }

  /**
   * Sets the status code and the body of the response.
   * @param {Object} ctx - The koa context.
   * @param {string} message - The message to send.
   */
  #setStatusResponseSuccess(ctx, status, message) {
    ctx.status = status
    ctx.message = JSON.stringify(message)
  }
}

module.exports = Tickets

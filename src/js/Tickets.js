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
  #deleteTicketEverywhere(id) {
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
  #getTicketFull(id) {
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
    try {
      const { method, name, description } = await ctx.request.body

      if (method !== 'createTicket') {
        throw new Error('Invalid method')
      }

      if (!name || !description) {
        throw new Error('Name and description are required')
      }

      this.#addTicket({ name, description })
      ctx.body = JSON.stringify(this.tickets)
      this.#setStatusResponseSuccess(ctx, 201, 'Ticket created')
    } catch (error) {
      this.#setStatusResponseError(ctx, 400, error.message)
      return
    }
  }

  /**
   * Updates a ticket with the given id and properties.
   * @param {Object} ctx - The koa context.
   * @param {string} ctx.request.body.id - The id of the ticket.
   * @param {string} ctx.request.body.name - The name of the ticket.
   * @param {string} ctx.request.body.description - The description of the ticket.
   */
  updateTicket = async (ctx) => {
    try {
      const id = ctx.params.id
      const props = await ctx.request.body
      props.status && (props.status = JSON.parse(props.status))

      if (!id) {
        throw new Error('Id is required')
      }

      this.#updateTickets(id, props)

      this.#setStatusResponseSuccess(ctx, 200, 'Ticket updated')
    } catch (error) {
      this.#setStatusResponseError(ctx, 400, error.message)
      return
    }
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
   * Deletes a ticket with the given id.
   * @param {Object} ctx - The koa context.
   * @param {string} ctx.params.id - The id of the ticket.
   */
  deleteTicket = async (ctx) => {
    try {
      const id = await ctx.params.id

      if (!id) {
        throw new Error('Id is required')
      }

      this.#deleteTicketEverywhere(id)

      this.#setStatusResponseSuccess(ctx, 200, 'Ticket deleted')
    } catch (error) {
      this.#setStatusResponseError(ctx, 400, error.message)
    }
  }

  /**
   * Returns a description of a ticket.
   * @param {Object} ctx - The koa context.
   * @param {string} ctx.params.id - The id of the ticket.
   */
  getDescription = async (ctx) => {
    try {
      const id = await ctx.params.id

      if (!id) {
        throw new Error('Id is required')
      }

      const ticket = this.#getTicketFull(id)

      if (!ticket) {
        throw new Error('Ticket not found')
      }

      ctx.body = JSON.stringify(ticket.description)

      this.#setStatusResponseSuccess(ctx, 200, 'Description received')
    } catch (error) {
      this.#setStatusResponseError(ctx, 400, error.message)
    }
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

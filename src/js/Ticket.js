const { v4: uuidv4 } = require('uuid')

/**
 * A class representing a ticket in the HelpDesk system.
 *
 * @class
 */
class Ticket {
  /**
   * Constructs a new Ticket object with the given name, description and
   * creation time.
   *
   * @param {Object} options - The options for creating the ticket.
   * @param {string} options.name - The name of the ticket.
   * @param {string} options.description - The description of the ticket.
   * @return {void}
   */
  constructor({ name, description }) {
    this.id = uuidv4()
    this.name = name
    this.description = description
    this.createdAt = new Date()
    this.status = false
  }
}

module.exports = Ticket

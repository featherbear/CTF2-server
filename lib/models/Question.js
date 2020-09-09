import { database } from '../db'

export default class {
  /* Class methods */

  static async getQuestion (id) {
    const data = database.getQuestion(id)
    if (!data) throw new Error('Question does not exist')
    const { title, description, category, value } = data
    return new this(id, title, description, category, value)
  }

  static async getQuestions () {
    return database.getQuestions().map(({ id, title, description, category, value }) => new this(id, title, description, category, value))
  }

  static async create (title, description = null, category, flag, value) {
    const result = database.createQuestion(title, description, category, flag, value)
    const { lastInsertRowid } = result
    return new this(lastInsertRowid, title, description, category, value)
  }

  static async delete (id) {
    const { changes } = database.deleteQuestion(id)
    if (!changes) throw new Error('Question does not exist')
    return true
  }

  static async update (id, data) {
    (await this.getQuestion(id))
    database.updateQuestion(id, data)
    return true
  }
  /* Instance methods */

  constructor (id, title, description, category, value) {
    this.id = id
    this.title = title
    this.description = description
    this.category = category
    this.value = value
  }

  async delete () {
    return this.constructor.delete(this.id)
  }

  async getFlag () {
    const { flag } = database.getQuestion(this.id)
    return flag
  }

  async solve (username) {
    const userId = database.getUserIdFromUsername(username)
    return database.solveQuestion(userId, this.id)
  }

  async unsolve (userId) {
    return database.unsolveQuestion(userId, this.id)
  }
}

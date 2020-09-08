import { database } from '../db'

export default class {
  /* Class methods */
  static async getCategories () {
    return database.getCategories().map(({ id, name }) => new this(id, name))
  }

  static async getCategory (id) {
    const data = database.getCategory(id)
    if (!data) throw new Error('Category does not exist')
    return new this(data.id, data.name)
  }

  static async create (name) {
    // Error will be thrown from SQL's UNIQUE check
    const { lastInsertRowid } = database.createCategory(name)
    return new this(lastInsertRowid, name)
  }

  static async delete (id) {
    const { changes } = database.deleteCategory(id)
    if (!changes) throw new Error('Category does not exist')
    return true
  }

  static async rename (id, newName) {
    await this.getCategory(id)
    database.renameCategory(id, newName)
    return true
  }
  /* Instance methods */

  constructor (id, name) {
    this.id = id
    this.name = name
  }

  async delete () {
    return this.constructor.delete(this.id)
  }

  async rename (newName) {
    return this.constructor.rename(this.id, newName)
  }

  async getQuestions () {
    return database.getQuestionsOfCategory(this.id)
  }
}

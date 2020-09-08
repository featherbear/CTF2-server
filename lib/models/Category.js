import { database } from '../db'

export default class {
  /* Class methods */

  static async create (name) {
    const { lastInsertRowid } = database.createCategory(name)
    return new this(lastInsertRowid, name)
  }

  static async getCategories () {
    return database.getCategories().map(({ id, name }) => new this(id, name))
  }

  /* Instance methods */

  constructor (id, name) {
    this.id = id
    this.name = name
  }

  async delete () {
    return database.deleteCategory(this.id)
  }

  async rename (newName) {
    return database.renameCategory(this.id, newName)
  }

  async getQuestions () {
    return database.getQuestionsOfCategory(this.id)
  }
}

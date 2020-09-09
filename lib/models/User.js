import BCrypt from 'bcrypt'
import { database } from '../db'

let JWT

export default class {
  /* Class methods */

  static setJWTHandler (jwt) {
    JWT = jwt
  }

  static async create (username, password, name) {
    const passwordHash = await BCrypt.hash(password, 10)
    database.createUser(username, passwordHash, name)
    return new this(username)
  }

  static async getPassword (username) {
    return database.getUserPassword(username)
  }

  static async login (username, password) {
    const userData = await this.getUser(username, true)
    if (!userData || !await BCrypt.compare(password, await this.getPassword(username))) {
      return null
    }

    return new this(username)
  }

  static async delete (username) {
    return database.deleteUser(username)
  }

  static async getUser (username, asJSON = false) {
    return asJSON ? await database.getUser(username) : new this(username)
  }

  static async getUsers (username) {
    return database.getUsers()
  }

  static async nameAvailable (name) {
    return database.nameAvailable(name)
  }

  static async usernameAvailable (username) {
    return database.usernameAvailable(username)
  }

  /* Instance methods */

  constructor (username) {
    this.username = username
  }

  async changePassword (newPassword) {
    const newPasswordHash = await BCrypt.hash(newPassword, 10)
    return database.changeUserPassword(this.username, newPasswordHash)
  }

  async changeName (newName) {
    return database.changeName(this.username, newName)
  }

  async getName () {
    return (await this.constructor.getUser(this.username, true)).name
  }

  async isAdmin () {
    return database.userIsAdmin(this.username)
  }

  getJWT () {
    return JWT.sign({ username: this.username })
  }

  async getId () {
    return this.id ? this.id : (this.id = await database.getUserIdFromUsername(this.username))
  }
}

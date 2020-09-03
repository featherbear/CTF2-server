import BCrypt from 'bcrypt'
import { database } from '../db'

let JWT

class User {
  /* Class methods */

  static setJWTHandler (jwt) {
    JWT = jwt
  }

  static async create (username, password, name) {
    const passwordHash = await BCrypt.hash(password, 10)
    database.createUser(username, passwordHash, name)
    return new User(username, name)
  }

  static async nameAvailable (name) {
    return database.nameAvailable(name)
  }

  static async usernameAvailable (username) {
    return database.usernameAvailable(username)
  }

  /* Instance methods */

  constructor (username, name) {
    this.username = username
    this.name = name
  }

  async changePassword (newPassword) {
    const newPasswordHash = await BCrypt.hash(newPassword, 10)
    database.changeUserPassword(this.username, newPasswordHash)
  }

  getJWT () {
    // Use previous token?
    return JWT.sign({ username: this.username, name: this.name })
  }

  get isAdmin () {
    return database.userIsAdmin(this.username)
  }
}

export default User

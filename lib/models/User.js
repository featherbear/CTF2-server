import BCrypt from 'bcrypt'
import { database } from '../db'

class User {
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

  constructor (username, name) {
    this.username = username
    this.name = name
  }

  async changePassword (newPassword) {
    const newPasswordHash = await BCrypt.hash(newPassword, 10)
    database.changeUserPassword(this.username, newPasswordHash)
  }
}

export default User

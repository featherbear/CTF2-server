import BCrypt from 'bcrypt'
import { database } from '../db'

class User {
  constructor (username, name) {
    this.username = username
    this.name = name
  }

  static async create (username, password, name) {
    const passwordHash = await BCrypt.hash(password, 10)
    database.createUser(username, passwordHash, name)
    return new User(username, name)
  }
}

export default User

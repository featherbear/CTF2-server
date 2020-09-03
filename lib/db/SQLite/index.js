import SQLite3 from 'better-sqlite3'

import ENUM from '../_enum'
import Schemas from './schemas'

export default class {
  constructor (CTF2_DATABASE) {
    const opts = {}

    // FIXME:
    if (process.env.DEBUG) { opts.verbose = console.debug }

    const db = (this.db = new SQLite3(CTF2_DATABASE, opts))

    // TODO: Mode to enable/disable WAL
    // https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/performance.md
    // db.pragma('journal_mode = WAL')

    for (const schemas of Object.values(Schemas)) {
      db.exec(schemas)
    }
  }

  transact () {
    return this.db.transaction(...arguments)
  }

  getUser (username) {
    return this.db.prepare(`SELECT name, password FROM ${ENUM.Users} WHERE username = ?`).get(username)
  }

  createUser (username, password, name) {
    const query = this.db.prepare(`INSERT INTO ${ENUM.Users} (username, name, password) VALUES (@username, @name, @password)`)

    try {
      return query.run({
        name: name || null,
        username,
        password
      })
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Username or name in use')
      }
    }
  }

  changeUserPassword (username, password) {
    return this.db.prepare(`UPDATE ${ENUM.Users} SET password = @password WHERE username = @username`).run({ username, password })
  }

  nameAvailable (name) {
    return (!!this.db.prepare(`SELECT 1 FROM ${ENUM.Users} WHERE name = ?`).get(name))
  }

  usernameAvailable (username) {
    return (!!this.db.prepare(`SELECT 1 FROM ${ENUM.Users} WHERE username = ?`).get(username))
  }

  userIsAdmin (username) {
    return (!!this.db.prepare(`SELECT 1 FROM ${ENUM.Users} WHERE username = ? AND isAdmin = 1`).get(username))
  }

  changeName (username, newName) {
    const query = this.db.prepare(`UPDATE ${ENUM.Users} SET name = @name WHERE username = @username`)

    try {
      return query.run({
        username,
        name: newName
      })
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Nname in use')
      }
    }
  }
}

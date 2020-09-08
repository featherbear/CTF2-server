import SQLite3 from 'better-sqlite3'

import ENUM from '../_enum'
import Schemas from './schemas'

export default class {
  constructor (CTF2_DATABASE) {
    const opts = {}
    if (process.env.DEBUG) { opts.verbose = console.debug }

    const db = (this.db = new SQLite3(CTF2_DATABASE, opts))

    // TODO: Mode to enable/disable WAL
    // https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/performance.md
    // db.pragma('journal_mode = WAL')

    for (const schemas of Object.values(Schemas)) {
      db.exec(schemas)
    }
  }

  transact (fn) {
    // Note: Only takes in a synchronous function
    return this.db.transaction(fn)
  }

  /* USERS */

  getUser (username) {
    return this.db.prepare(`SELECT * FROM ${ENUM.Users} WHERE username = ?`).get(username)
  }

  getUserIdFromUsername (username) {
    return this.db.prepare(`SELECT id FROM ${ENUM.Users} WHERE username = ?`).get(username)
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
    return (!this.db.prepare(`SELECT 1 FROM ${ENUM.Users} WHERE name = ?`).get(name))
  }

  usernameAvailable (username) {
    return (!this.db.prepare(`SELECT 1 FROM ${ENUM.Users} WHERE username = ?`).get(username))
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
        throw new Error('Name in use')
      }
    }
  }

  setPlayerHandicap (username, value) {
    return this.db.prepare(`UPDATE ${ENUM.Users} SET handicap = @handicap WHERE username = @username`).run({
      username,
      handicap: value
    })
  }

  deleteUser ({ userId, username }) {
    if (typeof userId === 'undefined') {
      userId = this.getUserIdFromUsername(username)
    }
    this.db.prepare(`DELETE FROM ${ENUM.Solves} WHERE user = ?`).run(userId)
    this.db.prepare(`DELETE FROM ${ENUM.Users} WHERE id = ?`).run(userId)
    return true
  }

  /* CATEGORIES */

  getCategory (id) {
    return this.db.prepare(`SELECT id, name FROM ${ENUM.Categories} WHERE id = ?`).get(id)
  }

  getCategories () {
    return this.db.prepare(`SELECT id, name FROM ${ENUM.Categories}`).all()
  }

  createCategory (name) {
    const query = this.db.prepare(`INSERT INTO ${ENUM.Categories} (name) VALUES (?)`)

    try {
      return query.run(name)
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Category name in use')
      }
    }
  }

  renameCategory (id, newName) {
    const query = this.db.prepare(`UPDATE ${ENUM.Categories} SET name = @name WHERE id = @id`)

    try {
      return query.run({
        id,
        name: newName
      })
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Name in use')
      }
    }
  }

  deleteCategory (id) {
    return this.db.prepare(`DELETE FROM ${ENUM.Categories} WHERE id = ?`).run(id)
  }

  getQuestionsOfCategory (id) {
    return this.db.prepare(`SELECT id, title, description, category, flag, value FROM ${ENUM.Questions} WHERE category = ?`).all(id)
  }
  /* QUESTIONS */

  getQuestion (id) {
    return this.db.prepare(`SELECT id, title, description, category, flag, value FROM ${ENUM.Questions} WHERE id = ?`).get(id)
  }

  getQuestions () {
    return this.db.prepare(`SELECT id, title, description, category, flag, value FROM ${ENUM.Questions}`).all()
  }

  createQuestion (title, description, category, flag, value) {
    const query = this.db.prepare(`INSERT INTO ${ENUM.Questions} (title, description, category, flag, value) VALUES (@title, @description, @category, @flag, @value)`)

    try {
      const res = query.run({
        title, description, category, flag, value
      })
      return res
    } catch (e) {
      switch (e.code) {
        case 'SQLITE_CONSTRAINT_FOREIGNKEY':
          throw new Error('Category ID does not exist')
        case 'SQLITE_CONSTRAINT_UNIQUE':
          throw new Error('Flag already used')
        default:
          throw new Error('Something bad happened')
      }
    }
  }

  updateQuestion (questionId, data) {
    const keys = ['title', 'description', 'category', 'flag', 'value']

    const statementBuilder = [`UPDATE ${ENUM.Questions} SET`]
    const values = []
    const valueBuilder = []
    for (const key of keys) {
      if (typeof data[key] !== 'undefined') {
        valueBuilder.push(`${key} = ?`)
        values.push(data[key])
      }
    }

    /* */
    if (values.length === 0) {
      throw new Error('No update data supplied')
    }
    /* */

    statementBuilder.push(valueBuilder.join(', '))

    statementBuilder.push('WHERE id = ?')
    values.push(questionId)

    const statement = statementBuilder.join(' ')

    try {
      return this.db.prepare(statement).run(values)
    } catch (e) {
      switch (e.code) {
        case 'SQLITE_CONSTRAINT_FOREIGNKEY':
          throw new Error('Category ID does not exist')
        case 'SQLITE_CONSTRAINT_UNIQUE':
          throw new Error('Flag already used')
        default:
          console.error(e.code, e.message)
          throw new Error('Something bad happened')
      }
    }
  }

  deleteQuestion (questionId) {
    this.db.prepare(`DELETE FROM ${ENUM.Solves} WHERE question = ?`).run(questionId)
    return this.db.prepare(`DELETE FROM ${ENUM.Questions} WHERE id = ?`).run(questionId)
  }

  /* SOLVES */

  solveQuestion (userId, questionId) {
    return this.db.prepare(`INSERT INTO ${ENUM.Solves} (user, question) VALUES (@user, @question)`).run({
      user: userId,
      question: questionId
    })
  }

  unsolveQuestion (userId, questionId) {
    return this.db.prepare(`DELETE FROM ${ENUM.Solves} WHERE user = @user AND question = @question`).run({
      user: userId,
      question: questionId
    })
  }
}

// Authentication related routes
import User from '../lib/models/User'
import { database } from '../lib/db'

export default function (app, opts, done) {
  app.post(
    '/login',
    {
      schema: {
        description: 'Authenticates a user'
      }
    },
    async () => {
      // const result = await BCrypt.compare(password, hash)
    }
  )

  app.post(
    '/register',
    {
      schema: {
        description: 'Registers a new user'
      }
    },
    async (req, res) => {
      const { username, name, password } = req.body
      if (!username || !password) {
        return res.FAIL('Username or password not supplied', 400)
      }

      const user = await User.create(username, password, name)
      res.OK(user)
    }
  )

  app.get(
    '/me',
    {
      preValidation: [app.authenticate],
      schema: {
        description: 'Get user details'
      }
    },
    async (req, res) => {
      // FIXME: Get user data from prehandler
      return ':)'
    }
  )

  // app.put(
  //   '/me',
  //   {
  //     preValidation: [app.authenticate],
  //     schema: {
  //       description: 'Update user details',
  //       body: {}
  //     }
  //   },
  //   async (req, res) => {
  //     const { name, password } = req.body

  //     // TODO: Transact

  //     // FIXME: Get user data from prehandler

  //     if (name) {
  //       // ...
  //     }

  //     if (password) {
  //       // ... .changePassword(password)
  //     }
  //   }
  // )

  app.post(
    '/usernameAvailable',
    {
      schema: {
        description: 'Check if a username is available',
        body: {
          username: { type: 'string', description: 'Username to check' }
        }
      }
    },
    async (req, res) => {
      const { username } = req.body
      if (!username) {
        return res.FAIL('No username supplied')
      }
      return res.OK(database.usernameAvailable(username))
    }
  )

  app.post(
    '/nameAvailable',
    {
      schema: {
        description: 'Check if a name is available',
        body: {
          name: { type: 'string', description: 'Name to check' }
        }
      }
    },
    async (req, res) => {
      const { name } = req.body
      if (!name) {
        return res.FAIL('No name supplied')
      }
      return res.OK(database.nameAvailable(name))
    }
  )

  done()
}

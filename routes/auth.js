// Authentication related routes
import User from '../lib/models/User'

export default function (app, opts, done) {
  app.post(
    '/login',
    {
      schema: {
        description: 'Authenticates a user',
        body: {
          username: { type: 'string', description: 'Username' },
          password: { type: 'string', description: 'Password' }
        }
      }
    },
    async (req, res) => {
      const { username, password } = req.body
      if (!username || !password) {
        return res.FAIL('Incorrect username / password')
      }

      const user = await User.login(username, password)
      if (!user) return res.FAIL('Incorrect username / password')

      return res.OK(user.getJWT())
    }
  )

  app.post(
    '/register',
    {
      schema: {
        description: 'Registers a new user',
        body: {
          name: { type: 'string', description: 'Display name' },
          username: { type: 'string', description: 'Username' },
          password: { type: 'string', description: 'Password' }
        }
      }
    },
    async (req, res) => {
      const { username, name, password } = req.body
      if (!username || !password) {
        return res.FAIL('Username or password not supplied', 400)
      }

      const user = await User.create(username, password, name)
      res.OK(user.getJWT())
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
      return res.OK({
        name: await req.User.getName(),
        username: req.User.username
      })
    }
  )

  app.put(
    '/me',
    {
      preValidation: [app.authenticate],
      schema: {
        description: 'Update user details',
        body: {
          name: { type: 'string', description: '(optional) New display name' },
          password: { type: 'string', description: '(optional) New password' }
        }
      }
    },
    async (req, res) => {
      const { name, password } = req.body

      if (!name && !password) {
        return res.FAIL('At least one of [name, password] is required')
      }

      if (name) {
        await req.User.changeName(name)
      }

      if (password) {
        await req.User.changePassword(password)
      }

      return res.OK()
    }
  )

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
      return res.OK(await User.usernameAvailable(username))
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
      return res.OK(await User.nameAvailable(name))
    }
  )

  done()
}

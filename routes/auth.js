// Authentication related routes
import User from '../lib/models/User'

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

  app.post(
    '/usernameAvailable',
    {
      schema: {
        description: 'Check if a username is available'
      }
    },
    () => {}
  )

  done()
}

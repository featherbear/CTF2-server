// Authentication related routes
import BCrypt from 'bcrypt'

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
    async () => {
      // const hash = await BCrypt.hash('123456', 10)
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

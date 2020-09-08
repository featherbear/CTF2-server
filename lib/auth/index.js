import fastifyJWT from 'fastify-jwt'
import fp from 'fastify-plugin'
import User from '../models/User'

export default fp(async (app, opts) => {
  await app.register(fastifyJWT, opts)
  User.setJWTHandler(app.jwt)

  app.decorate('authenticate', async (req, res) => {
    try {
      await req.jwtVerify()
      req.User = new User(req.user.username, req.user.name)
    } catch {
      res.FAIL('Not authenticated', 401)
    }
  })

  app.decorate('authorise', async (req, res) => {
    if (!req.user) {
      return res.FAIL('Not authenticated', 401)
    }

    if (!req.User.isAdmin()) {
      return res.FAIL('Not authorised', 403)
    }
  })
})

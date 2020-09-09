import fastifyJWT from 'fastify-jwt'
import fp from 'fastify-plugin'
import User from '../models/User'

function functionWithComment (fn, comment) {
  fn.comment = comment
  return fn
}

export default fp(async (app, opts) => {
  await app.register(fastifyJWT, { secret: 'CTF2_DUMMY_SECRET', ...opts })
  User.setJWTHandler(app.jwt)

  app.decorate(
    'authenticate',
    functionWithComment(async (req, res) => {
      try {
        await req.jwtVerify()
        req.User = new User(req.user.username, req.user.name)
      } catch {
        res.FAIL('Not authenticated', 401)
      }
    }, 'User must be logged in')
  )

  app.decorate(
    'authorise',
    functionWithComment(async (req, res) => {
      if (!req.user) {
        return res.FAIL('Not authenticated', 401)
      }

      if (!await req.User.isAdmin()) {
        return res.FAIL('Not authorised', 403)
      }
    }, 'User must be an admin')
  )
})

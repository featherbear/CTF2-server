import fastify from 'fastify'
import fastifyHelmet from 'fastify-helmet'

import { init as initDatabase } from './lib/db'

require('dotenv').config()

const app = fastify()
app.register(fastifyHelmet)

{
  const { CTF2_DATABASE } = process.env

  if (!CTF2_DATABASE) {
    console.warn('CTF2_DATABASE variable not set!\n  Using default database: game.db')
    app.decorate('db', initDatabase('game.db'))
  } else {
    app.decorate('db', initDatabase(CTF2_DATABASE))
  }
}

{
  let { CTF2_SECRET } = process.env

  if (!CTF2_SECRET) {
    CTF2_SECRET = require('crypto').randomBytes(30).toString('hex')
    console.warn('CTF2_SECRET variable not set!\n  Using generated secret: ' + CTF2_SECRET)
  }

  app.register(require('./lib/jwt'), {
    secret: CTF2_SECRET
  })
}

app.register(require('./routes'))

const { PORT, HOST } = process.env
app.listen(PORT || 8000, HOST || '0.0.0.0').then(function (a) {
  const { address: HOST, port: PORT } = app.server.address()
  console.info(`Project CTF² server listening on ${HOST}:${PORT}`)
})

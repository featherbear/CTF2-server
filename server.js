import fastify from 'fastify'
import fastifyHelmet from 'fastify-helmet'

import { init as initDatabase } from './lib/db'

require('dotenv').config()

const app = fastify()
app.register(fastifyHelmet)

const { CTF2_DATABASE } = process.env

if (!CTF2_DATABASE) {
  console.warn('CTF2_DATABASE variable not set! Defaulting to game.db')
  app.decorate('db', initDatabase('game.db'))
} else {
  app.decorate('db', initDatabase(CTF2_DATABASE))
}

app.register(require('fastify-jwt'), {
  secret: process.env.CTF2_SECRET || require('crypto').randomBytes(30).toString('hex')
})
app.register(require('./routes'))

const { PORT, HOST } = process.env
app.listen(PORT || 8000, HOST || '0.0.0.0').then(function (a) {
  const { address: HOST, port: PORT } = app.server.address()
  console.info(`Project CTF² server listening on ${HOST}:${PORT}`)
})

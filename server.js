import fastify from 'fastify'
import fastifyHelmet from 'fastify-helmet'

require('dotenv').config()

const app = fastify()
app.register(fastifyHelmet)
app.register(require('./routes'))

const { PORT, HOST } = process.env
app.listen(PORT || 3001, HOST || '0.0.0.0').then(function (a) {
  const { address: HOST, port: PORT } = app.server.address()
  console.info(`Project CTF² server listening on ${HOST}:${PORT}`)
})

console.log(app.stack)

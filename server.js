import fastify from 'fastify'
import fastifyHelmet from 'fastify-helmet'

require('dotenv').config()
const { PORT, HOST, CTF2_GAME_URL } = process.env

const app = fastify()
app.register(fastifyHelmet)

app.get('/', (req, res) => {
  return (CTF2_GAME_URL) ? res.redirect(CTF2_GAME_URL) : 'Try harder'
})
app.get('/hello', (req, res) => {
  return {
    /* Server alive check */
    hello: 'world!'
  }
})

app.listen(PORT || 3001, HOST || '0.0.0.0').then(function (a) {
  const { address: HOST, port: PORT } = app.server.address()
  console.info(`Project CTF² server listening on ${HOST}:${PORT}`)
})

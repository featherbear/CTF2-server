export default function (app, opts, done) {
  const { CTF2_GAME_URL } = process.env

  app.decorateReply('OK', function (data) {
    const response = { result: true }
    if (typeof data !== 'undefined') response.data = data
    this.send(response)
  })

  app.decorateReply('FAIL', function (data, code) {
    const response = { result: false }
    if (typeof data !== 'undefined') response.data = data

    if (typeof code !== 'undefined') this.code(code)
    this.send(response)
  })

  app.setErrorHandler(function (error, req, res) {
    res.FAIL(error.message)
  })

  app.register(require('./auth'), { prefix: '/auth' })
  app.register(require('./score'), { prefix: '/score' })

  app.get('/', { hide: true }, (req, res) => {
    return CTF2_GAME_URL ? res.redirect(CTF2_GAME_URL) : 'Try harder'
  })

  app.get('/hello', {
    schema: {
      description: 'Server health check'
    }
  }, (req, res) => {
    const data = {
      /* Server alive check */
      hello: 'world!',

      GAME_URL: CTF2_GAME_URL
    }

    return Object.fromEntries(Object.entries(data).filter(([key, value]) => typeof value !== 'undefined'))
  })

  done()
}

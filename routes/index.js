export default function (app, opts, done) {
  const { CTF2_GAME_URL } = process.env

  app.get('/', (req, res) => {
    return CTF2_GAME_URL ? res.redirect(CTF2_GAME_URL) : 'Try harder'
  })

  app.get('/hello', (req, res) => {
    return {
      /* Server alive check */
      hello: 'world!'
    }
  })

  done()
}

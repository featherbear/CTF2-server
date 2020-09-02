// Score related routes

export default function (app, opts, done) {
  app.get(
    '/top',
    {
      schema: {
        description: 'Get the top 10 players/teams'
      }
    },
    async (req, res) => {
      return ':)'
    }
  )

  app.get(
    '/top/:n',
    {
      schema: {
        description: 'Get the top `n` players/teams'
      }
    },
    async (req, res) => {
      const n = Math.abs(parseInt(req.params.n)) || 0
      return n
    }
  )

  done()
}

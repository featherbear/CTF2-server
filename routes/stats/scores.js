// Score related routes

import { database } from '../../lib/db'

const defaultN = 10

export default function (app, opts, done) {
  app.get('/',
    {
      schema: {
        description: 'Get all player scores'
      }
    },
    async (req, res) => res.OK(database.getScores())
  )

  app.get(
    '/top',
    {
      schema: {
        description: `Get the top ${defaultN} players/teams`
      }
    },
    async (req, res) =>
      res.OK(database.getTopNScores(defaultN))
  )

  app.get(
    '/top/:n',
    {
      schema: {
        description: 'Get the top `n` players/teams',
        params: {
          n: { type: 'integer', description: 'Number of players/teams' }
        }
      }
    },
    async (req, res) => {
      const n = parseInt(req.params.n)
      if (n < 0) {
        return res.FAIL('>:( Hmph')
      }

      return res.OK(database.getTopNScores(n))
    }
  )

  done()
}

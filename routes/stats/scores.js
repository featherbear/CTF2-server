// Score related routes

import { database } from '../../lib/db'

const defaultN = 10;

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
        description: 'Get the top `n` players/teams'
      }
    },
    async (req, res) => {
      const n = Math.abs(parseInt(req.params.n)) || defaultN
      return res.OK(database.getTopNScores(n))
    }
  )

  done()
}

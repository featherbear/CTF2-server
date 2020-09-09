// Score related routes

import { database } from '../../lib/db'

export default function (app, opts, done) {
  app.get('/',
    {
      schema: {
        description: 'Get all question solves'
      }
    },
    async (req, res) => {
      return res.OK(database.getSolves())
    })

  app.get('/:id',
    {
      schema: {
        description: 'Get players who have solved a specific question',
        query: {
          id: { type: 'integer', description: 'Question ID' }
        }
      }
    },
    async (req, res) => {
      const { id } = req.params
      return res.OK(database.getUserSolvesByQuestion(id))
    })

  done()
}

import Question from '../../lib/models/Question'

export default function (app, opts, done) {
  app.get(
    '/',
    {
      preValidation: [app.authenticate],
      schema: {
        description: 'Get questions'
      }
    },
    async (req, res) => {
      return res.OK(await Question.getQuestions())
    }
  )

  app.post(
    '/',
    {
      preValidation: [app.authenticate, app.authorise],
      schema: {
        description: 'Create a question',
        body: {
          title: { type: 'string', description: 'Title' },
          description: { type: 'string', description: 'Description' },
          category: { type: 'integer', description: 'Category ID' },
          flag: { type: 'string', description: 'Flag' },
          value: { type: 'integer', description: 'Value' }
        }
      }
    },
    async (req, res) => {
      const { title, description, category, flag, value } = req.body

      try {
        return res.OK((await Question.create(title, description, category, flag, value)).id)
      } catch (e) {
        return res.FAIL(e.message)
      }
    }
  )

  app.put(
    '/',
    {
      preValidation: [app.authenticate, app.authorise],
      schema: {
        description: 'Update a question',
        body: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Question ID' },
            title: { type: 'string', description: 'Title' },
            description: { type: 'string', description: 'Description' },
            category: { type: 'integer', description: 'Category ID' },
            flag: { type: 'string', description: 'Flag' },
            value: { type: 'integer', description: 'Value' }
          },
          required: ['id'],
          anyOf: [
            { required: ['title'] },
            { required: ['description'] },
            { required: ['category'] },
            { required: ['flag'] },
            { required: ['value'] }
          ]
        }
      }
    },
    async (req, res) => {
      const { id, title, description, category, flag, value } = req.body

      try {
        return res.OK(
          await Question.update(id, {
            title,
            description,
            category,
            flag,
            value
          })
        )
      } catch (e) {
        return res.FAIL(e.message)
      }
    }
  )

  app.delete(
    '/',
    {
      preValidation: [app.authenticate, app.authorise],
      schema: {
        description: 'Delete a question',
        body: {
          id: { type: 'integer', description: 'Question ID' }
        }
      }
    },
    async (req, res) => {
      const { id } = req.body

      try {
        return res.OK(await Question.delete(id))
      } catch (e) {
        return res.FAIL(e.message)
      }
    }
  )

  app.post(
    '/getFlag',
    {
      preValidation: [app.authenticate, app.authorise],
      schema: {
        description: 'Get a question flag',
        body: {
          id: { type: 'integer', description: 'Question ID' }
        }
      }
    },
    async (req, res) => {
      const { id } = req.body

      try {
        return res.OK(await (await Question.getQuestion(id)).getFlag())
      } catch (e) {
        return res.FAIL(e.message)
      }
    }
  )

  app.post(
    '/solve',
    {
      preValidation: [app.authenticate],
      schema: {
        description: 'Solve a question',
        body: {
          id: { type: 'integer', description: 'Question ID' },
          flag: { type: 'string', description: 'Flag' }
        }
      }
    },
    async (req, res) => {
      const { id, flag } = req.body

      try {
        const question = await Question.getQuestion(id)
        if (flag === await question.getFlag()) {
          try {
            await question.solve(req.User.username)
          } catch {
            return res.FAIL('Question already solved')
          }

          return res.OK()
        }
      } catch {
      }
      return res.FAIL()
    }
  )

  app.delete(
    '/solve',
    {
      preValidation: [app.authenticate, app.authorise],
      schema: {
        description: 'Unsolve a question',
        body: {
          questionId: { type: 'integer', description: 'Question ID' },
          userId: { type: 'integer', description: 'User ID' }
        }
      }
    },
    async (req, res) => {
      const { questionId, userId } = req.body

      const question = await Question.getQuestion(questionId)
      const { changes } = await question.unsolve(userId)
      return changes ? res.OK() : res.FAIL()
    }
  )

  done()
}

import Category from '../../lib/models/Category'

export default function (app, opts, done) {
  app.get(
    '/',
    {
      preValidation: [app.authenticate],
      schema: {
        description: 'Get categories'
      }
    },
    async (req, res) => {
      return res.OK(await Category.getCategories())
    }
  )

  app.post(
    '/',
    {
      preValidation: [app.authenticate, app.authorise],
      schema: {
        description: 'Create a category',
        body: {
          name: { type: 'string', description: 'Category' }
        }
      }
    },
    async (req, res) => {
      const { name } = req.body

      try {
        return res.OK(await Category.create(name))
      } catch (e) {
        return res.FAIL(e.message)
      }
    }
  )

  done()
}

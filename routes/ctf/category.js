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

  app.delete(
    '/',
    {
      preValidation: [app.authenticate, app.authorise],
      schema: {
        description: 'Delete a category',
        body: {
          id: { type: 'integer', description: 'Category ID' }
        }
      }
    },
    async (req, res) => {
      const { id } = req.body

      try {
        return res.OK(await Category.delete(id))
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
        description: 'Rename a category',
        body: {
          id: { type: 'integer', description: 'Category ID' },
          name: { type: 'string', description: 'Category Name' }
        }
      }
    },
    async (req, res) => {
      const { id, name } = req.body

      try {
        return res.OK(await Category.rename(id, name))
      } catch (e) {
        return res.FAIL(e.message)
      }
    }
  )

  done()
}

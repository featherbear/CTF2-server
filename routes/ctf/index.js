export default function (app, opts, done) {
  app.register(require('./category'), { prefix: '/category' })

  done()
}

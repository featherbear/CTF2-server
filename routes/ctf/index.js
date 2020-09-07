export default function (app, opts, done) {
  app.register(require('./categories'), { prefix: '/categories' })

  done()
}

export default function (app, opts, done) {
  app.register(require('./category'), { prefix: '/category' })
  app.register(require('./question'), { prefix: '/question' })

  done()
}

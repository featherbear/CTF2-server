export default function (app, opts, done) {
  app.register(require('./scores'), { prefix: '/scores' })
  app.register(require('./solves'), { prefix: '/solves' })

  done()
}

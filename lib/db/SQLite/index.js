import SQLite3 from 'better-sqlite3'
import Base from '../_base'

import Schemas from './schemas'

export default class extends Base {
  constructor () {
    super()

    const opts = {

    }
    if (process.env.DEBUG) {
      opts.verbose = console.debug
    }
    const db = (this.db = new SQLite3(':memory:', opts))

    // TODO: Mode to enable/disable WAL
    // https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/performance.md
    db.pragma('journal_mode = WAL')
  }
}

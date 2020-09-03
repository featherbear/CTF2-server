import SQLite3 from 'better-sqlite3'

import ENUM from '../_enum'
import Schemas from './schemas'

export default class {
  constructor (CTF2_DATABASE) {
    const opts = {}

    // FIXME:
    if (process.env.DEBUG) { opts.verbose = console.debug }

    const db = (this.db = new SQLite3(CTF2_DATABASE, opts))

    // TODO: Mode to enable/disable WAL
    // https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/performance.md
    // db.pragma('journal_mode = WAL')

    for (const schemas of Object.values(Schemas)) {
      db.exec(schemas)
    }
  }
}

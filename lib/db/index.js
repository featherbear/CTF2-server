import MongoDB from './MongoDB'
import SQLite from './SQLite'

export const connectors = {
  MongoDB,
  SQLite
}

export let database

export const init = (CTF2_DATABASE) => {
  if (!CTF2_DATABASE) throw new Error('CTF2_DATABASE variable not set!')

  // Check for `mongodb://...` or `mongodb+srv://...`
  if (/^mongodb(\+srv)?:\/\/.+/gi.test(CTF2_DATABASE)) {
    return (database = new MongoDB(CTF2_DATABASE))
  }

  return (database = new SQLite(CTF2_DATABASE))
}

import ENUM from '../../_enum'

export default `
CREATE TABLE IF NOT EXISTS ${ENUM.Users} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    name TEXT,
    password TEXT NOT NULL,
    handicap INTEGER DEFAULT 0,

    isAdmin INTEGER DEFAULT 0,
    
    UNIQUE (username),
    UNIQUE (name)
)
`

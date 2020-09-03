import ENUM from '../../_enum'

export default `
CREATE TABLE IF NOT EXISTS ${ENUM.Categories} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    
    UNIQUE (name)
)
`

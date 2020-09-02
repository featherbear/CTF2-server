export default `
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    name TEXT,
    password TEXT,
    _isAdmin INTEGER DEFAULT 0,
    
    UNIQUE (username)
)
`

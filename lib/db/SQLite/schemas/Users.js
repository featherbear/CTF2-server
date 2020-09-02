export default `
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    name TEXT,
    _hash TEXT NOT NULL,
    _salt TEXT NOT NULL,
    _isAdmin INTEGER DEFAULT 0,
    
    UNIQUE (username)
)
`

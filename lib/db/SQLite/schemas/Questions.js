export default `
CREATE TABLE IF NOT EXISTS Questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    flag TEXT NOT NULL,
    value INTEGER NOT NULL,
    category INTEGER NOT NULL,

    FOREIGN KEY (category) REFERENCES Categories (id),

    UNIQUE (flag)
)`

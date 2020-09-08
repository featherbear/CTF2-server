import ENUM from '../../_enum'

export default `
CREATE TABLE IF NOT EXISTS ${ENUM.Questions} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category INTEGER NOT NULL,
    flag TEXT NOT NULL,
    value INTEGER NOT NULL,

    FOREIGN KEY (category) REFERENCES Categories (id),

    UNIQUE (flag)
)`

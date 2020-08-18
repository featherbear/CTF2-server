class SQLQuery:
    createTable = """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            name TEXT,
            _hash TEXT NOT NULL,
            _salt TEXT NOT NULL,
            
            UNIQUE (username)
        )
        """

    add = """
        INSERT
        INTO users (username, name, _hash, _salt)
        VALUES (?, ?, ?, ?)
        """

    delete = "DELETE FROM users WHERE id = ?"

    changeName = """
        UPDATE users
        SET name = ?
        WHERE id = ?
        """

    changeHashSalt = """
        UPDATE users
        SET _hash = ?, _salt = ?
        WHERE id = ?
        """
    passwordCheck = "SELECT id FROM users WHERE username = ? AND _hash = cHash(?, _salt)"

    getUserByUsername = "SELECT id, name FROM users WHERE username = ?"
    getUserById = "SELECT username, name FROM users WHERE id = ?"
    getUsers = "SELECT id, username, name FROM users"

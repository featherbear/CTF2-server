export default `
CREATE TABLE IF NOT EXISTS Solves (
    user INTEGER NOT NULL,
    question INTEGER NOT NULL,

    FOREIGN KEY (user) REFERENCES Users (id),
    FOREIGN KEY (question) REFERENCES Questions (id),
    
    UNIQUE (user, question)
)
`

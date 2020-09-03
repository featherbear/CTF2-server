import ENUM from '../../_enum'

export default `
CREATE TABLE IF NOT EXISTS ${ENUM.Solves} (
    user INTEGER NOT NULL,
    question INTEGER NOT NULL,

    FOREIGN KEY (user) REFERENCES Users (id),
    FOREIGN KEY (question) REFERENCES Questions (id),
    
    UNIQUE (user, question)
)
`

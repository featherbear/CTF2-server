from typing import Union

from .SQLQuery import SQLQuery
from .. import database


class SQLMethod:
    @staticmethod
    def createUser(username: str, name: str, hash: str, salt: str):
        return database.insert(SQLQuery.add, (username.lower(), name, hash, salt))

    @staticmethod
    def deleteUser(user: int):
        return database.update(SQLQuery.delete, (user,))

    @staticmethod
    def changeHashSalt(user: int, hash: str, salt: str):
        return database.update(SQLQuery.changeHashSalt, (hash, salt, user))

    @staticmethod
    def changeName(user: int, name: str):
        return database.update(SQLQuery.changeName, (name, user))

    @staticmethod
    def checkPassword(username: str, password: str):
        return database.fetchOne(SQLQuery.passwordCheck, (username.lower(), password))

    @staticmethod
    def getUser(user: Union[str, int]):
        if type(user) is str:
            return database.fetchOne(SQLQuery.getUserByUsername, (user,))
        else:
            return database.fetchOne(SQLQuery.getUserById, (user,))

    @staticmethod
    def getUsers():
        return database.fetchAll(SQLQuery.getUsers)

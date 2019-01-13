# run in same directory

import sqlite3

with sqlite3.connect("database2.db") as connection:
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE categories (name text, colour int, parentId int)")
    cursor.execute("CREATE TABLE flashcards (front text, back text, reversible boolean, categoryId int)")
    connection.commit()

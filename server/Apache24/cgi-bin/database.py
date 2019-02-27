import os
import sqlite3

database_path = os.path.abspath(os.path.join(__file__, os.pardir, os.pardir, os.pardir, "database.db"))


class Flashcard():
    def __init__(self, front: str, back: str, is_reversible: bool, category_id: int):
        self.front = front
        self.back = back
        self.category_id = category_id
        self.is_reversible = is_reversible


class Category():
    def __init__(self, name: str, colour: int, parent_id: int):
        self.name = name
        self.colour = colour
        self.parent_id = parent_id


def add_flashcard(flashcard):
    with sqlite3.connect(database_path) as connection:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO flashcards VALUES (?, ?, ?, ?)", (flashcard.front, flashcard.back, flashcard.is_reversible, flashcard.category_id))
        connection.commit()


def add_category(category):
    with sqlite3.connect(database_path) as connection:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO categories VALUES (?, ?, ?)", (category.name, category.colour, category.parent_id))
        connection.commit()


def get_flashcard(flashcard_id):
    with sqlite3.connect(database_path) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT rowid, * FROM flashcards WHERE rowid=?", [str(flashcard_id), ])
        flashcard = cursor.fetchone()
    if flashcard is not None:
        f = Flashcard(*flashcard[1:])
        f.id = flashcard[0]
        return f


def get_flashcards_in_category(category_id):
    with sqlite3.connect(database_path) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT rowid, * FROM flashcards WHERE categoryId=?", [str(category_id), ])
        flashcard_tuples = cursor.fetchall()
    # Convert tuples to Flashcards
    flashcards = []
    for flashcard_tuple in flashcard_tuples:
        f = Flashcard(*flashcard_tuple[1:])
        f.id = flashcard_tuple[0]
        flashcards.append(f)
    return flashcards


def get_subcategories(parent_category_id):
    with sqlite3.connect(database_path) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT rowid, * FROM categories WHERE parentId=?", [str(parent_category_id), ])
        category_tuples = cursor.fetchall()
    # Convert tuples to Categories
    categories = []
    for category_tuple in category_tuples:
        c = Category(*category_tuple[1:])
        c.id = category_tuple[0]
        categories.append(c)
    return categories


def get_category(category_id):
    with sqlite3.connect(database_path) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT rowid, * FROM categories WHERE rowid=?", [str(category_id), ])
        category = cursor.fetchone()
    if category is not None:
        c = Category(*category[1:])
        c.id = category[0]
        return c

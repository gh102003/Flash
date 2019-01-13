#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import json
import database
import cgitb
cgitb.enable()

print("Content-type:application/json\r\n")

request_data = cgi.FieldStorage()

# Get category from database
category = database.get_category(request_data["id"].value) # Category
if category is not None:
    category = category.__dict__ # tuple of values

    # Get category's flashcards from database
    flashcards = database.get_flashcards_in_category(request_data["id"].value)  # list of Flashcards
    flashcards = [flashcard.__dict__ for flashcard in flashcards]  # list of dictionaries

    # Add flashcards to category
    category["flashcards"] = flashcards

    # Get subcategories from database
    subcategories = database.get_subcategories(request_data["id"].value)  # list of Categories
    subcategories = [subcategory.__dict__ for subcategory in subcategories]  # list of dictionaries

    # Add subcategories to category
    category["subcategories"] = subcategories

    print(json.dumps(category))
else:
    print("{}")

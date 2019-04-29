#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import json
import database
import cgitb


def set_children(category_dict):
    category_dict["flashcards"] = [flashcard.__dict__ for flashcard in database.get_flashcards_in_category(category_dict["id"])]
    category_dict["subcategories"] = []
    subcategories = database.get_subcategories(category_dict["id"])

    for subcategory in subcategories:
        subcategory_dict = set_children(subcategory.__dict__)
        category_dict["subcategories"].append(subcategory_dict)

    return category_dict


cgitb.enable()

print("Content-type:text/plain\r\n")

request_data = cgi.FieldStorage()
category_id = request_data["id"].value
category_dict = database.get_category(category_id).__dict__

to_return = set_children(category_dict)
print(json.dumps(to_return))

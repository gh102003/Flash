#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import json
import database
import cgitb


def set_parent(category_dict):
    if category_dict["parent_id"] is not None:
        parent_id = category_dict["parent_id"]
        parent = database.get_category(parent_id).__dict__
        set_parent(parent)
        category_dict["parent"] = parent

    category_dict.pop("parent_id")
    return category_dict


cgitb.enable()

print("Content-type:text/plain\r\n")

# Get a linked-list style of parent categories for use in the breadcrumb

request_data = cgi.FieldStorage()
category_id = request_data["id"].value
category_dict = database.get_category(category_id).__dict__

to_return = set_parent(category_dict)
print(json.dumps(to_return))

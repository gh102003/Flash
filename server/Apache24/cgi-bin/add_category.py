#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import database
import cgitb

cgitb.enable()

print("Content-type:text/plain\r\n")

form_data = cgi.FieldStorage()

name = form_data.getvalue("name")
colour = form_data.getvalue("colour")
parent_id = form_data.getvalue("parentId")

# Create category
category = database.Category(name, colour, parent_id)

database.add_category(category)

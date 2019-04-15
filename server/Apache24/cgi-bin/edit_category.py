#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import database
import cgitb

cgitb.enable()

print("Content-type:text/plain\r\n")

form_data = cgi.FieldStorage()

category_id = form_data.getvalue("categoryId")
field = form_data.getvalue("field")
new_value = form_data.getvalue("newValue")

if field == "name":
    database.rename_category(category_id, new_value)

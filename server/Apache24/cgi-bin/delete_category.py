#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import database
import cgitb

cgitb.enable()

print("Content-type:text/plain\r\n")

form_data = cgi.FieldStorage()
category_id = form_data.getvalue("categoryId")

database.remove_category(category_id)

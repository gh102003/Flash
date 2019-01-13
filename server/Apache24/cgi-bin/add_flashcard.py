#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import database
import cgitb

cgitb.enable()

print("Content-type:text/plain\r\n")

form_data = cgi.FieldStorage()

front = form_data.getvalue("front")
back = form_data.getvalue("back")
is_reversible = form_data.getvalue("isReversible") == "on"
category_id = form_data.getvalue("categoryId")

# Create flashcard
flashcard = database.Flashcard(front, back, is_reversible, category_id)

database.add_flashcard(flashcard)

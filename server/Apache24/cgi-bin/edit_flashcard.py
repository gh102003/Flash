#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import database
import cgitb

cgitb.enable()

print("Content-type:text/plain\r\n")

form_data = cgi.FieldStorage()

flashcard_id = form_data.getvalue("flashcardId")
field = form_data.getvalue("field")
new_value = form_data.getvalue("newValue")

if field == "front":
    database.edit_flashcard_front(flashcard_id, new_value)
elif field == "back":
    database.edit_flashcard_back(flashcard_id, new_value)
    
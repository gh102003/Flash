#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import database
import cgitb

cgitb.enable()

print("Content-type:text/plain\r\n")

form_data = cgi.FieldStorage()
flashcard_id = form_data.getvalue("flashcardId")

database.remove_flashcard(flashcard_id)

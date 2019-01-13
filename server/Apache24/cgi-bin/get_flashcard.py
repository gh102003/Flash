#!"C:\Users\georg\AppData\Local\Programs\Python\Python37\python.exe"

import cgi
import json
import database

print("Content-type:application/json\r\n")

request_data = cgi.FieldStorage()

# Get flashcard from database
flashcard = database.get_flashcard(request_data["id"].value)

print(json.dumps(flashcard.__dict__))

import mysql.connector

db = mysql.connector.connect(
    host='159.203.143.52',  # Replace with your host (enclosed in quotes)
    user='verdaxxed_python',
    password='Amina@1218'
)

command = db.cursor()
command.execute("SHOW DATABASES;")
for i in command:
    print(i)
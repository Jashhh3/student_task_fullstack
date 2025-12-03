import pymysql

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='123456789'
)

try:
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS task_manager_db")
        print("Database 'task_manager_db' created successfully")
finally:
    connection.close()

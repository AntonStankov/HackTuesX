from flask import Flask, request
from map_generation import Ocean
import mysql.connector
import configparser

app = Flask(__name__)

config = configparser.ConfigParser()
config.read('config.ini')
username = config['database']['username']
password = config['database']['password']

cnx = mysql.connector.connect(user=username, password=password,
                              host='127.0.0.1',
                              database='bezzevsovi')

@app.route('/generate', methods=['GET'])
def generate_map():
    ocean = Ocean()
    ocean.generate_land()
    # send and sql query to the database to write the ocean_string to the database
    cursor = cnx.cursor()
    cursor.execute("INSERT INTO ocean (ocean_string) VALUES (%s)", (ocean.convert_to_string(),))
    cnx.commit()

    return ocean.convert_to_string()


if __name__ == '__main__':
    app.run(debug=True)
    cnx.close()